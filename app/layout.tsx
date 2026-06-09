import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Tectigon Academy - Ndërto të Ardhmen në Teknologji',
    template: '%s | Tectigon Academy',
  },
  description:
    'Tectigon Academy është qendër profesionale trajnimi që fokuson aftësi praktike dhe përgatitje për tregun e punës, në Kosovë dhe ndërkombëtarisht.',
  keywords: [
    'trajnim IT',
    'kurse programimi',
    'Kosovë',
    'trajnim profesional',
    'zhvillim web',
    'siguri kibernetike',
    'data science',
    'karrierë në teknologji',
  ],
  authors: [{ name: 'Tectigon Academy' }],
  creator: 'Tectigon Academy',
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    url: 'https://tectigon.com',
    siteName: 'Tectigon Academy',
    title: 'Tectigon Academy - Ndërto të Ardhmen në Teknologji',
    description:
      'Trajnime moderne dhe praktike për profesionet më të kërkuara, me instruktorë ekspertë dhe projekte reale.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tectigon Academy - Ndërto të Ardhmen në Teknologji',
    description:
      'Trajnime moderne dhe praktike për profesionet më të kërkuara, të orientuara drejt rezultateve.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sq" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
