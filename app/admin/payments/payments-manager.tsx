'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Eye, RefreshCw, Search, WalletCards } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCurrentStaffUser } from '@/lib/auth'
import { getAdminTrainings, type Training } from '@/lib/trainings'
import {
  adminPaymentsExportUrl,
  type AdminPayment,
  listAdminPayments,
  type PaymentFilters,
  type PaymentLog,
  type PaymentStatus,
  recheckPayment,
  showAdminPayment,
  statusClass,
  updatePaymentStatus,
} from '@/lib/payments'
import { formatTrainingPrice } from '@/lib/trainings'

const statuses: Array<PaymentStatus | 'all'> = ['all', 'pending', 'processing', 'completed', 'failed', 'canceled', 'refunded']

export function AdminPayments() {
  const router = useRouter()
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [trainings, setTrainings] = useState<Training[]>([])
  const [summary, setSummary] = useState({ total_revenue: 0, completed: 0, pending: 0, failed: 0, canceled: 0 })
  const [filters, setFilters] = useState<PaymentFilters>({})
  const [selected, setSelected] = useState<{ payment: AdminPayment; logs: PaymentLog[] } | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    getCurrentStaffUser()
      .then((response) => {
        if (!mounted) return
        if (!response.user) {
          router.replace('/staff-login')
          return
        }
        void loadPayments()
        void getAdminTrainings().then(setTrainings).catch(() => undefined)
      })
      .catch(() => {
        if (mounted) router.replace('/staff-login')
      })
      .finally(() => {
        if (mounted) setIsCheckingSession(false)
      })

    return () => {
      mounted = false
    }
  }, [router])

  const exportUrl = useMemo(() => adminPaymentsExportUrl(filters), [filters])

  const loadPayments = async (nextFilters = filters) => {
    setIsLoading(true)
    setError('')
    try {
      const data = await listAdminPayments(nextFilters)
      setPayments(data.payments)
      setSummary(data.summary)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load payments.')
    } finally {
      setIsLoading(false)
    }
  }

  const setFilter = (key: keyof PaymentFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value === 'all' ? '' : value }))
  }

  const applyFilters = () => void loadPayments(filters)

  const openDetails = async (paymentId: number) => {
    setError('')
    try {
      setSelected(await showAdminPayment(paymentId))
    } catch (detailsError) {
      setError(detailsError instanceof Error ? detailsError.message : 'Could not load details.')
    }
  }

  const handleRecheck = async (paymentId: number) => {
    setMessage('')
    setError('')
    try {
      const response = await recheckPayment(paymentId)
      setMessage(response.message)
      await loadPayments()
    } catch (recheckError) {
      setError(recheckError instanceof Error ? recheckError.message : 'Could not re-check payment.')
    }
  }

  const handleStatus = async (payment: AdminPayment, status: PaymentStatus) => {
    const note = status === 'failed' ? window.prompt('Reason/note required for failed status:') || '' : window.prompt('Optional admin note:') || ''
    if (status === 'failed' && !note.trim()) return

    setMessage('')
    setError('')
    try {
      await updatePaymentStatus(payment.id, status, note)
      setMessage(`Payment marked as ${status}.`)
      await loadPayments()
      if (selected?.payment.id === payment.id) {
        await openDetails(payment.id)
      }
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Could not update status.')
    }
  }

  if (isCheckingSession) {
    return <AdminShell title="Checking session..." />
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] gradient-bg pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Button asChild variant="ghost" className="mb-4 px-0 text-muted-foreground hover:text-foreground">
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">Admin</p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Payments</h1>
            <p className="mt-2 text-muted-foreground">Review orders, statuses, provider placeholders, and payment logs.</p>
          </div>

          <Button asChild variant="outline" className="self-start md:self-auto">
            <a href={exportUrl}>
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          </Button>
        </div>

        {(message || error) && (
          <div className={`mb-6 rounded-lg border p-4 text-sm ${error ? 'border-destructive/40 bg-destructive/10 text-destructive' : 'border-primary/40 bg-primary/10 text-primary'}`}>
            {error || message}
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-5">
          <SummaryCard label="Total revenue" value={formatTrainingPrice(summary.total_revenue)} />
          <SummaryCard label="Completed" value={summary.completed.toString()} />
          <SummaryCard label="Pending" value={summary.pending.toString()} />
          <SummaryCard label="Failed" value={summary.failed.toString()} />
          <SummaryCard label="Canceled" value={summary.canceled.toString()} />
        </div>

        <div className="glass-card mb-6 rounded-xl p-5">
          <div className="grid gap-4 md:grid-cols-7">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search order, name, email..." value={filters.search || ''} onChange={(event) => setFilter('search', event.target.value)} className="pl-9" />
            </div>
            <Input placeholder="Customer email" value={filters.customer_email || ''} onChange={(event) => setFilter('customer_email', event.target.value)} />
            <select value={filters.status || 'all'} onChange={(event) => setFilter('status', event.target.value)} className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground">
              {statuses.map((status) => <option key={status} value={status}>{status === 'all' ? 'All statuses' : status}</option>)}
            </select>
            <select value={filters.training_id || ''} onChange={(event) => setFilter('training_id', event.target.value)} className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground">
              <option value="">All trainings</option>
              {trainings.map((training) => <option key={training.id} value={training.id}>{training.title}</option>)}
            </select>
            <Input type="date" value={filters.date_from || ''} onChange={(event) => setFilter('date_from', event.target.value)} />
            <Input type="date" value={filters.date_to || ''} onChange={(event) => setFilter('date_to', event.target.value)} />
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={applyFilters} disabled={isLoading}>Apply filters</Button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          {isLoading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Loading payments...</p>
          ) : payments.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-border text-muted-foreground">
                  <tr>
                    <th className="py-3 pr-4 font-medium">Order</th>
                    <th className="py-3 pr-4 font-medium">Training</th>
                    <th className="py-3 pr-4 font-medium">Customer</th>
                    <th className="py-3 pr-4 font-medium">Amount</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 pr-4 font-medium">Provider</th>
                    <th className="py-3 pr-4 font-medium">Created</th>
                    <th className="py-3 pr-4 font-medium">Paid</th>
                    <th className="py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-4 pr-4 font-medium text-foreground">{payment.order_number}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{payment.training_title}</td>
                      <td className="py-4 pr-4">
                        <p className="text-foreground">{payment.customer_name || '-'}</p>
                        <p className="text-xs text-muted-foreground">{payment.customer_email || '-'}</p>
                      </td>
                      <td className="py-4 pr-4 text-foreground">{formatTrainingPrice(payment.amount)}</td>
                      <td className="py-4 pr-4"><StatusBadge status={payment.status} /></td>
                      <td className="py-4 pr-4 text-muted-foreground">{payment.payment_provider}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{formatDate(payment.created_at)}</td>
                      <td className="py-4 pr-4 text-muted-foreground">{payment.paid_at ? formatDate(payment.paid_at) : '-'}</td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="icon-sm" onClick={() => void openDetails(payment.id)} aria-label="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="outline" size="icon-sm" onClick={() => void handleRecheck(payment.id)} aria-label="Re-check status">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => void handleStatus(payment, 'canceled')} disabled={payment.status === 'completed'}>
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selected.payment.order_number}</h2>
                  <p className="text-sm text-muted-foreground">{selected.payment.training_title}</p>
                </div>
                <Button type="button" variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Detail label="Customer" value={`${selected.payment.customer_name || '-'} / ${selected.payment.customer_email || '-'}`} />
                <Detail label="Phone" value={selected.payment.customer_phone || '-'} />
                <Detail label="Amount" value={formatTrainingPrice(selected.payment.amount)} />
                <Detail label="Status" value={selected.payment.status} />
                <Detail label="Provider transaction ID" value={selected.payment.provider_transaction_id || '-'} />
                <Detail label="Bank order ID" value={selected.payment.bank_order_id || '-'} />
                <Detail label="Approval code" value={selected.payment.approval_code || '-'} />
                <Detail label="Provider" value={selected.payment.payment_provider} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {(['pending', 'processing', 'completed', 'failed', 'canceled', 'refunded'] as PaymentStatus[]).map((status) => (
                  <Button key={status} type="button" variant="outline" size="sm" onClick={() => void handleStatus(selected.payment, status)}>
                    Mark {status}
                  </Button>
                ))}
              </div>

              <details className="mt-6 rounded-lg border border-border p-4">
                <summary className="cursor-pointer text-sm font-medium text-foreground">Raw provider response</summary>
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">{selected.payment.raw_response || 'No raw response stored.'}</pre>
              </details>

              <div className="mt-6">
                <h3 className="mb-3 font-semibold text-foreground">Payment logs</h3>
                <div className="space-y-3">
                  {selected.logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No logs yet.</p>
                  ) : selected.logs.map((log) => (
                    <div key={log.id} className="rounded-lg border border-border bg-background/30 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(log.created_at)}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {log.status_before || '-'} → {log.status_after || '-'}
                      </p>
                      {log.error_message && <p className="mt-2 text-xs text-destructive">{log.error_message}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${statusClass(status)}`}>{status}</span>
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

function AdminShell({ title }: { title: string }) {
  return (
    <section className="min-h-[calc(100vh-5rem)] gradient-bg pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="glass-card mx-auto max-w-md rounded-xl p-8 text-center">
          <WalletCards className="mx-auto mb-4 h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </section>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}
