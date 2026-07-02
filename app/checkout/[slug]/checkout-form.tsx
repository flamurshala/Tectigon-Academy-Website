'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Course } from '@/lib/api'
import { createOrder, PaymentApiError } from '@/lib/payments'
import { formatTrainingPrice, getTrainingImageUrl } from '@/lib/trainings'

export function CheckoutForm({ training }: { training: Course }) {
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const imageUrl = getTrainingImageUrl(training.imageUrl || training.image || null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await createOrder({
        training_id: Number(training.id),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      })

      if (response.redirect_url) {
        window.location.href = response.redirect_url
        return
      }

      router.push(`/payment/result?order_number=${encodeURIComponent(response.order_number)}`)
    } catch (submitError) {
      if (submitError instanceof PaymentApiError && submitError.details.bank_error_code) {
        if (process.env.NODE_ENV !== 'production') {
          console.info('Bank payment error', submitError.details)
        }
        setError('Payment could not be started. Please contact support.')
      } else {
        setError(submitError instanceof Error ? submitError.message : 'Could not create order.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] gradient-bg pt-32 pb-20">
      <div className="container mx-auto max-w-5xl px-4">
        <Button asChild variant="ghost" className="mb-6 px-0 text-muted-foreground hover:text-foreground">
          <Link href="/courses">
            <ArrowLeft className="h-4 w-4" />
            Back to trainings
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                {imageUrl ? <img src={imageUrl} alt={training.title} className="h-full w-full object-cover" /> : <BookOpen className="h-8 w-8" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{training.title}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{training.shortDescription}</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background/30 p-4">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{formatTrainingPrice(training.price)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
            <h2 className="mb-1 text-xl font-semibold text-foreground">Customer details</h2>
            <p className="mb-5 text-sm text-muted-foreground">No card data is collected here.</p>

            <div className="space-y-4">
              <Field label="Name">
                <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
              </Field>
              <Field label="Email">
                <Input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} required />
              </Field>
              <Field label="Phone">
                <Input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} />
              </Field>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground">
                {isSubmitting ? 'Creating order...' : 'Create order'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}
