import { Suspense } from 'react'
import { PaymentStatusPage } from '../status-page'

export default function PaymentCanceledPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusPage title="Payment canceled" />
    </Suspense>
  )
}
