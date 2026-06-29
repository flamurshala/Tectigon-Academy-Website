export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'refunded'

export type AdminPayment = {
  id: number
  order_id: number
  order_number: string
  training_id: number
  training_title: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  amount: number
  currency: 'EUR'
  status: PaymentStatus
  payment_provider: string
  provider_payment_id: string | null
  provider_transaction_id: string | null
  approval_code: string | null
  bank_order_id: string | null
  bank_hpp_url: string | null
  notes: string | null
  raw_response: string | null
  created_at: string
  updated_at: string
  paid_at: string | null
  canceled_at: string | null
  failed_at: string | null
  refunded_at: string | null
}

export type PaymentLog = {
  id: number
  action: string
  status_before: string | null
  status_after: string | null
  request_payload: string | null
  response_payload: string | null
  http_status_code: number | null
  error_message: string | null
  created_at: string
}

export type PaymentFilters = {
  status?: string
  training_id?: string
  customer_email?: string
  search?: string
  date_from?: string
  date_to?: string
}

const ADMIN_PAYMENT_API = '/backend/api/admin/payments'
const PUBLIC_PAYMENT_API = '/backend/api/payments'

async function parseJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('Payment API returned a non-JSON response.')
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Payment request failed.')
  }
  return data
}

function queryString(filters: PaymentFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  return params.toString()
}

export async function listAdminPayments(filters: PaymentFilters = {}) {
  const qs = queryString(filters)
  const response = await fetch(`${ADMIN_PAYMENT_API}/list.php${qs ? `?${qs}` : ''}`, {
    credentials: 'include',
  })
  return parseJson<{
    success: boolean
    payments: AdminPayment[]
    summary: {
      total_revenue: number
      completed: number
      pending: number
      failed: number
      canceled: number
    }
    pagination: {
      page: number
      per_page: number
      total: number
    }
  }>(response)
}

export async function showAdminPayment(id: number) {
  const response = await fetch(`${ADMIN_PAYMENT_API}/show.php?id=${id}`, {
    credentials: 'include',
  })
  return parseJson<{ success: boolean; payment: AdminPayment; logs: PaymentLog[] }>(response)
}

export async function updatePaymentStatus(paymentId: number, status: PaymentStatus, note = '') {
  const response = await fetch(`${ADMIN_PAYMENT_API}/update-status.php`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_id: paymentId, status, note }),
  })
  return parseJson<{ success: boolean; payment: AdminPayment }>(response)
}

export async function recheckPayment(paymentId: number) {
  const response = await fetch(`${ADMIN_PAYMENT_API}/recheck.php`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_id: paymentId }),
  })
  return parseJson<{ success: boolean; message: string }>(response)
}

export function adminPaymentsExportUrl(filters: PaymentFilters = {}) {
  const qs = queryString(filters)
  return `${ADMIN_PAYMENT_API}/export.php${qs ? `?${qs}` : ''}`
}

export async function createOrder(input: {
  training_id: number
  customer_name: string
  customer_email: string
  customer_phone: string
}) {
  const response = await fetch(`${PUBLIC_PAYMENT_API}/create-order.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return parseJson<{
    success: boolean
    order: {
      id: number
      order_number: string
      training_id: number
      training_title: string
      amount: number
      currency: 'EUR'
      status: PaymentStatus
    }
    payment: {
      id: number
      status: PaymentStatus
      payment_provider: string
    }
    redirect_url: string | null
  }>(response)
}

export async function checkOrder(order_number: string) {
  const response = await fetch(`${PUBLIC_PAYMENT_API}/check-order.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_number }),
  })
  return parseJson<{ success: boolean; payment: AdminPayment }>(response)
}

export function statusClass(status: PaymentStatus) {
  return {
    completed: 'bg-green-500/10 text-green-400 border-green-500/30',
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    failed: 'bg-red-500/10 text-red-400 border-red-500/30',
    canceled: 'bg-muted text-muted-foreground border-border',
    refunded: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  }[status]
}
