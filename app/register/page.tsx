import type { Metadata } from 'next'
import { RegisterContent } from '@/components/register/register-content'

export const metadata: Metadata = {
  title: 'Regjistrohu',
  description:
    'Apliko për trajnimet e Tectigon Academy. Zgjidh orarin dhe programin, pastaj dërgo aplikimin.',
}

export default function RegisterPage() {
  return <RegisterContent />
}

