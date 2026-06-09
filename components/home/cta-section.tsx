'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Award, Clock, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticleBackground } from '@/components/particle-background'

const features = [
  {
    icon: Award,
    title: 'Certifikim profesional',
    description: 'Certifikata që mbështesin karrierën tuaj në tregun vendor dhe ndërkombëtar',
  },
  {
    icon: Clock,
    title: 'Orar fleksibil',
    description: 'Zgjidhni paradite ose pasdite sipas nevojës suaj',
  },
  {
    icon: Headphones,
    title: 'Mbështetje në karrierë',
    description: 'Udhëzim dhe këshillim edhe pas përfundimit të trajnimit',
  },
]

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-accent/10" />
      <ParticleBackground className="opacity-30" particleCount={30} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Gati të nisni <span className="gradient-text">rrugëtimin</span> në teknologji?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Ndërtoni aftësi reale përmes projekteve praktike dhe përgatituni për punësim, zhvillim profesional apo vetëpunësim. E ardhmja juaj në teknologji nis këtu.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex flex-col items-center gap-3 p-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 glow-primary px-8 py-6 text-lg"
            >
              <Link href="/courses">
                Trajnimet
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted hover:text-white px-8 py-6 text-lg"
            >
              <Link href="/contact">
                Na kontaktoni
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
