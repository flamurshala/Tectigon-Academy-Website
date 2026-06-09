'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { ParticleBackground } from '@/components/particle-background'
import { Input } from '@/components/ui/input'

export function VerifyCertificateContent() {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [certificateId, setCertificateId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/verify-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          surname,
          certificateId,
        }),
      })

      if (!response.ok) {
        let message = 'Certifikata nuk u gjet.'

        try {
          const data = (await response.json()) as { message?: string }
          message = data.message || message
        } catch {
          // Keep the fallback message if the server did not return JSON.
        }

        throw new Error(message)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate-${certificateId.trim() || 'download'}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Certifikata nuk u gjet.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <ParticleBackground className="opacity-40" particleCount={30} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              Verifikim
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Verifiko <span className="gradient-text">Certifikaten</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Shkruani emrin, mbiemrin dhe ID-ne e certifikates per ta shkarkuar.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <GlassCard hover={false}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Emri
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Shkruaj emrin..."
                      required
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="surname"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Mbiemri
                    </label>
                    <Input
                      id="surname"
                      name="surname"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="Shkruaj mbiemrin..."
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="certificateId"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    ID e certifikates
                  </label>
                  <Input
                    id="certificateId"
                    name="certificateId"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="Shkruaj ID-ne..."
                    required
                    className="h-11"
                  />
                </div>

                {error ? (
                  <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                >
                  {isLoading ? (
                    <>
                      Duke kerkuar <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Shkarko certifikaten <Download className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </GlassCard>
          </div>
        </div>
      </section>
    </main>
  )
}
