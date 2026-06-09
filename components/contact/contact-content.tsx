'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building,
  Headphones,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { GlassCard } from '@/components/ui/glass-card'
import { ParticleBackground } from '@/components/particle-background'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email-i',
    value: 'contact@tectigonacademy.com',
    href: 'mailto:contact@tectigonacademy.com',
    description: 'For general inquiries',
  },
  {
    icon: Phone,
    title: 'Na Kontaktoni',
    value: '+383 48 66 79 79',
    href: 'tel:+38344123456',
    description: 'Mon-Fri, 9am-6pm CET',
  },
  {
    icon: MapPin,
    title: 'Lokacioni ynë',
    value: 'Rr. Jakovë Xoxa,',
    description: 'Prishtina, Kosova 10000',
  },
  {
    icon: Clock,
    title: 'Orari  ',
    value: 'Mon - Fri: 9:00 - 20:00',
    description: 'Sat: 10:00 - 14:00',
  },
]

const faqs = [
  {
    question: 'Si mund të regjistrohem në një kurs?',
    answer: 'Shfletoni katalogun e kurseve, zgjidhni kursin që dëshironi dhe klikoni "Regjistrohu Tani". Ju mund ta përfundoni procesin e regjistrimit online ose të vizitoni kampusin tonë.',
  },
  {
    question: 'A ofroni plane pagese?',
    answer: 'Po! Ne ofrojmë plane fleksibile pagese për të gjitha kurset tona. Kontaktoni ekipin tonë të pranimeve për të diskutuar opsionet që ju përshtaten më së miri.',
  },
  {
    question: 'A njihen certifikatat ndërkombëtarisht?',
    answer: 'Certifikatat tona janë të akredituara nga institucione evropiane të arsimit teknologjik dhe njihen nga punëdhënës në mbarë botën.',
  },
  {
    question: 'A ofroni ndihmë për punësim?',
    answer: 'Absolutisht! Të gjithë të diplomuarit përfitojnë qasje në shërbimet tona të karrierës, duke përfshirë rishikimin e CV-së, përgatitjen për intervistë dhe lidhje të drejtpërdrejta me mbi 150 partnerë punësimi.',
  },
]

export function ContactContent() {
  const [formData, setFormData] = useState({
    emri: '',
    mbiemri: '',
    email: '',
    telefoni: '',
    mesazhi: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data: { success?: boolean; message?: string } = await res.json().catch(() => ({}))

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Ndodhi një gabim. Ju lutem provoni përsëri.')
      }

      setStatus('success')
      setMessage(data.message || 'Mesazhi u dërgua me sukses.')
      setFormData({ emri: '', mbiemri: '', email: '', telefoni: '', mesazhi: '' })
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Ndodhi një gabim. Ju lutem provoni përsëri.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
              Kontakto
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Do të donim të <span className="gradient-text">dëgjonim</span> nga ju
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Keni pyetje rreth trajnimeve, regjistrimit apo shërbimeve të karrierës?
              Ekipi ynë është këtu për t’ju ndihmuar në hapin e radhës.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {info.href ? (
                  <a href={info.href}>
                    <GlassCard className="h-full text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground mb-1">{info.title}</h3>
                      <p className="text-primary font-medium mb-1">{info.value}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </GlassCard>
                  </a>
                ) : (
                  <GlassCard className="h-full text-center" hover={false}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{info.title}</h3>
                    <p className="text-primary font-medium mb-1">{info.value}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </GlassCard>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Na dërgoni një mesazh</h2>
                    <p className="text-sm text-muted-foreground">Zakonisht përgjigjemi brenda 24 orësh</p>
                  </div>
                </div>

                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Mesazhi u dërgua!</h3>
                    <p className="text-muted-foreground mb-6">{message}</p>
                    <Button
                      onClick={() => setStatus('idle')}
                      variant="outline"
                    >
                      Dërgo një mesazh tjetër
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emri" className="block text-sm font-medium text-foreground mb-2">
                          Emër *
                        </label>
                        <input
                          type="text"
                          id="emri"
                          name="emri"
                          value={formData.emri}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Emri"
                        />
                      </div>
                      <div>
                        <label htmlFor="mbiemri" className="block text-sm font-medium text-foreground mb-2">
                          Mbiemër *
                        </label>
                        <input
                          type="text"
                          id="mbiemri"
                          name="mbiemri"
                          value={formData.mbiemri}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Mbiemri"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Emaili"
                        />
                      </div>
                      <div>
                        <label htmlFor="telefoni" className="block text-sm font-medium text-foreground mb-2">
                          Numri i telefonit *
                        </label>
                        <input
                          type="tel"
                          id="telefoni"
                          name="telefoni"
                          value={formData.telefoni}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="+383 44 123 456"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Mesazhi *
                      </label>
                      <textarea
                        id="mesazhi"
                        name="mesazhi"
                        value={formData.mesazhi}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Na tregoni si mund t’ju ndihmojmë..."
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-destructive text-sm">{message}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
                    >
                      {status === 'loading' ? (
                        'Duke dërguar...'
                      ) : (
                        <>
                          Dërgo Mesazhin <Send className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </GlassCard>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Map Placeholder */}
              <GlassCard hover={false} className="h-64 overflow-hidden p-0">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">Prishtina, Kosovo</p>
                  </div>
                </div>
              </GlassCard>

              {/* Quick Links */}
              <GlassCard hover={false}>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-primary" />
                  Quick Support
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:admissions@tectigon.com"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Building className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Administrata </p>
                      <p className="text-sm text-muted-foreground">administrata@tectigonacademy.com</p>
                    </div>
                  </a>
                  <a
                    href="mailto:support@tectigon.com"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Headphones className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Supporti</p>
                      <p className="text-sm text-muted-foreground">+383 48 66 79 79 </p>
                    </div>
                  </a>
                  <a
                    href="mailto:careers@tectigon.com"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Për praktikë</p>
                      <p className="text-sm text-muted-foreground">internship@tectigonacademy.com</p>
                    </div>
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            subtitle="FAQ"
            title="Pyetje të Shpeshta"
            description="Përgjigje të shpejta për pyetjet më të zakonshme rreth Tectigon Academy."
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard hover={false}>
                  <h3 className="text-lg font-bold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
