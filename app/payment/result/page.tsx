import { Suspense } from 'react'
import { PaymentStatusPage } from '../status-page'

export default function PaymentResultPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusPage title="Payment status" />
    </Suspense>
  )
}
