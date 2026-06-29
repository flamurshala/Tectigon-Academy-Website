import { Suspense } from 'react'
import { PaymentStatusPage } from '../status-page'

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusPage title="Order created" />
    </Suspense>
  )
}
