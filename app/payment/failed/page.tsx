import { Suspense } from 'react'
import { PaymentStatusPage } from '../status-page'

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusPage title="Payment failed" />
    </Suspense>
  )
}
