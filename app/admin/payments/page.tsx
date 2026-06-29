import type { Metadata } from 'next'
import { AdminPayments } from './payments-manager'

export const metadata: Metadata = {
  title: 'Payments',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPaymentsPage() {
  return <AdminPayments />
}
