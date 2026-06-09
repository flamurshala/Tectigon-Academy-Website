import { ContactContent } from '@/components/contact/contact-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakti',
  description:
    'Na kontaktoni për pyetje rreth trajnimeve, regjistrimit dhe mundësive të karrierës. Ekipi ynë është këtu për t’ju ndihmuar.',
}

export default function ContactPage() {
  return <ContactContent />
}
