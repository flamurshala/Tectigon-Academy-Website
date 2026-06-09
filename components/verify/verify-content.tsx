'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { ParticleBackground } from '@/components/particle-background'
import { Input } from '@/components/ui/input'

export function VerifyCertificateContent() {
  const [certificateId, setCertificateId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
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
              Verifiko <span className="gradient-text">Certifikatën</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Kërko certifikatën tuaj duke shenuar ID më poshtë!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <GlassCard hover={false}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="certificateId"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    ID e certifikatës
                  </label>
                  <Input
                    id="certificateId"
                    name="certificateId"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="Shkruaj ID-në..."
                    required
                    className="h-11"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                  >
                    Kërko <Search className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </section>
    </main>
  )
}

