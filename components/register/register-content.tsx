'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CheckCircle, Mail, Send, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { ParticleBackground } from '@/components/particle-background'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

const scheduleOptions = [
  { value: 'paradite', label: 'Paradite' },
  { value: 'pasdite', label: 'Pasdite' },
] as const

const trainingOptions = [
  'Full Stack Developer',
  'Graphic Design & UI/UX',
  'Java Development',
  'C# .NET',
  'Cyber Security',
  'TechBlend',
  'DevOps',
  'Digital Marketing',
  'Python Data Science',
  'Project Management & Product Ownership',
  'WordPress & Shopify',
  'Video Production',
  '3D Modeling',
  'QA',
] as const

const phoneRegex = /^[+()0-9\s-]{7,20}$/

const registerSchema = z.object({
  emri: z.string().trim().min(1, 'Emri është i detyrueshëm.'),
  mbiemri: z.string().trim().min(1, 'Mbiemri është i detyrueshëm.'),
  emaili: z
    .string()
    .trim()
    .min(1, 'Emaili është i detyrueshëm.')
    .email('Emaili nuk është valid.'),
  telefoni: z
    .string()
    .trim()
    .min(1, 'Numri i telefonit është i detyrueshëm.')
    .regex(phoneRegex, 'Numri i telefonit nuk është valid.'),
  orari: z.enum(['paradite', 'pasdite'], {
    required_error: 'Orari është i detyrueshëm.',
  }),
  trajnimi: z.enum(trainingOptions, {
    required_error: 'Trajnimi është i detyrueshëm.',
  }),
})

type RegisterValues = z.infer<typeof registerSchema>

type SubmitState = 'idle' | 'submitting' | 'animating' | 'success' | 'error'

function SentEnvelopeAnimation({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('relative h-32 w-full overflow-hidden', className)}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        variants={{
          initial: { opacity: 0, scale: 0.9, y: 10 },
          animate: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl"
            animate={{ opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <motion.div
            className="relative flex items-center justify-center gap-3 rounded-2xl border border-border bg-card/40 px-6 py-4 backdrop-blur-sm"
            animate={{ y: [0, -26, -60], x: [0, 10, 24], opacity: [1, 1, 0] }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            <Mail className="h-6 w-6 text-primary" />
            <div className="text-sm font-medium text-foreground">
              Dërgimi i aplikimit…
            </div>
            <Send className="h-5 w-5 text-primary" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/60"
            animate={{
              x: [0, 40 + i * 26],
              y: [0, -40 - i * 18],
              opacity: [0.8, 0],
              scale: [1, 0.4],
            }}
            transition={{
              duration: 0.8,
              delay: 0.12 * i,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

export function RegisterContent() {
  const [state, setState] = useState<SubmitState>('idle')
  const [submitMessage, setSubmitMessage] = useState<string>('')

  const defaultValues = useMemo<RegisterValues>(
    () => ({
      emri: '',
      mbiemri: '',
      emaili: '',
      telefoni: '',
      orari: 'paradite',
      trajnimi: 'Full Stack Developer',
    }),
    [],
  )

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const onSubmit = async (values: RegisterValues) => {
    if (state === 'submitting' || state === 'animating') return
    setState('submitting')
    setSubmitMessage('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data: { success?: boolean; message?: string } = await res.json().catch(() => ({}))

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Ndodhi një gabim. Ju lutem provoni përsëri.')
      }

      await new Promise((r) => setTimeout(r, 250))
      setState('animating')

      await new Promise((r) => setTimeout(r, 900))
      setState('success')
      form.reset(defaultValues)
    } catch (e) {
      setState('error')
      setSubmitMessage(e instanceof Error ? e.message : 'Ndodhi një gabim. Ju lutem provoni përsëri.')
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <ParticleBackground className="opacity-35" particleCount={26} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center justify-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              <Sparkles className="h-4 w-4" />
              Regjistrohu
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Apliko për <span className="gradient-text">Trajnimin</span> tënd
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Plotëso të dhënat, zgjidh orarin dhe programin. Ne do të të
              kontaktojmë shumë shpejt për hapat e radhës.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <GlassCard hover={false}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Regjistrohu Tani!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Të gjitha fushat janë të detyrueshme.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {state === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Aplikimi u dërgua me sukses!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Faleminderit. Do të të kontaktojmë së shpejti.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          form.reset(defaultValues)
                          setState('idle')
                        }}
                      >
                        Dërgo një aplikim tjetër
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="emri"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Emri</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Emri " {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="mbiemri"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mbiemri</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Mbimeri" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="emaili"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Emaili</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="Emaili"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="telefoni"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Numri i telefonit</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      inputMode="tel"
                                      placeholder="+383 44 123 456"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="orari"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Orari</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="grid sm:grid-cols-2 gap-3"
                                  >
                                    {scheduleOptions.map((opt) => (
                                      <label
                                        key={opt.value}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
                                      >
                                        <div className="flex items-center gap-3">
                                          <RadioGroupItem value={opt.value} />
                                          <span className="font-medium text-foreground">
                                            {opt.label}
                                          </span>
                                        </div>
                                      </label>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="trajnimi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trajnimi</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Zgjidh trajnimin" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {trainingOptions.map((opt) => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="pt-2">
                            <Button
                              type="submit"
                              disabled={state === 'submitting' || state === 'animating'}
                              className="w-full bg-primary text-white hover:bg-primary/90 glow-primary py-6 text-lg"
                            >
                              {state === 'submitting' ? 'Duke dërguar…' : 'Apliko Tani'}
                            </Button>
                          </div>

                          {state === 'error' && submitMessage && (
                            <p className="text-destructive text-sm">{submitMessage}</p>
                          )}
                        </form>
                      </Form>

                      <AnimatePresence>
                        {state === 'animating' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-6"
                          >
                            <SentEnvelopeAnimation />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="lg:col-span-2 space-y-6"
            >
              <GlassCard hover={false}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Çfarë ndodh më pas?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Proces i shpejtë dhe i thjeshtë.
                    </p>
                  </div>
                </div>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="mt-0.5 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      1
                    </span>
                    Ne verifikojmë aplikimin tuaj.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      2
                    </span>
                    Ju kontaktojmë për detaje dhe orar.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      3
                    </span>
                    Konfirmojmë regjistrimin dhe fillimin.
                  </li>
                </ol>
              </GlassCard>

              <GlassCard hover={false} className="bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Keni pyetje?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Na shkruani dhe do t’ju ndihmojmë.
                    </p>
                  </div>
                  <Button asChild variant="outline">
                    <a href="/contact">Kontakto</a>
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

