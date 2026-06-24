import type { Metadata } from 'next'
import { StaffLoginForm } from './staff-login-form'

export const metadata: Metadata = {
  title: 'Staff Login',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StaffLoginPage() {
  return <StaffLoginForm />
}
