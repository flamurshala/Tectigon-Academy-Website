'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { checkOrder, type AdminPayment, statusClass } from '@/lib/payments'
import { formatTrainingPrice } from '@/lib/trainings'

export function PaymentStatusPage({ title }: { title: string }) {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || ''
  const [payment, setPayment] = useState<AdminPayment | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) {
      setError('Order number is missing.')
      setIsLoading(false)
      return
    }

    checkOrder(orderNumber)
      .then((response) => setPayment(response.payment))
      .catch((statusError) => setError(statusError instanceof Error ? statusError.message : 'Could not verify order.'))
      .finally(() => setIsLoading(false))
  }, [orderNumber])

  return (
    <section className="min-h-[calc(100vh-5rem)] gradient-bg pt-32 pb-20">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="glass-card rounded-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {isLoading ? (
            <p className="mt-4 text-muted-foreground">Checking saved payment status...</p>
          ) : error ? (
            <p className="mt-4 text-destructive">{error}</p>
          ) : payment ? (
            <div className="mt-6 space-y-4">
              <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${statusClass(payment.status)}`}>
                {payment.status}
              </span>
              <div className="rounded-lg border border-border bg-background/30 p-4 text-left">
                <p className="text-sm text-muted-foreground">Order</p>
                <p className="font-medium text-foreground">{payment.order_number}</p>
                <p className="mt-3 text-sm text-muted-foreground">Training</p>
                <p className="font-medium text-foreground">{payment.training_title}</p>
                <p className="mt-3 text-sm text-muted-foreground">Amount</p>
                <p className="font-medium text-foreground">{formatTrainingPrice(payment.amount)}</p>
              </div>
            </div>
          ) : null}

          <Button asChild className="mt-8 bg-primary text-primary-foreground">
            <Link href="/courses">Back to trainings</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
