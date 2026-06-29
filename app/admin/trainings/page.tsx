import type { Metadata } from 'next'
import { AdminTrainings } from './trainings-manager'

export const metadata: Metadata = {
  title: 'Manage Trainings',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminTrainingsPage() {
  return <AdminTrainings />
}
