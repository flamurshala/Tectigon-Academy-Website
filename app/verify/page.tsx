import type { Metadata } from 'next'
import { VerifyCertificateContent } from '@/components/verify/verify-content'

export const metadata: Metadata = {
  title: 'Verifiko Certifikatën',
  description:
    'Kërko certifikatën tuaj duke shenuar ID më poshtë!',
}

export default function VerifyCertificatePage() {
  return <VerifyCertificateContent />
}

