import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/api'
import { CheckoutForm } from './checkout-form'

export const metadata: Metadata = {
  title: 'Checkout',
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const training = await getCourse(slug)

  if (!training) {
    notFound()
  }

  return <CheckoutForm training={training} />
}
