'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Target,
  Eye,
  Heart,
  Users,
  Linkedin,
  Twitter,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { GlassCard } from '@/components/ui/glass-card'
import { ParticleBackground } from '@/components/particle-background'
import { AnimatedCounter } from '@/components/animated-counter'
import type { TeamMember, Stats } from '@/lib/api'

interface AboutContentProps {
  team: TeamMember[]
  stats: Stats
}

const values = [
  {
    icon: Target,
    title: 'Cilësi',
    description:
      'Ofrijmë trajnime cilësore të ndërtuara sipas kërkesave reale të industrisë dhe trendeve bashkëkohore.',
  },
  {
    icon: Heart,
    title: 'Mundësi për të gjithë',
    description:
      'Besojmë se çdo individ duhet të ketë akses në edukim profesional dhe mundësi reale zhvillimi.',
  },
  {
    icon: Users,
    title: 'Komunitet',
    description:
      'Ndërtojmë ura lidhëse mes studentëve, alumnëve dhe partnerëve për rritje të vazhdueshme dhe sukses.',
  },
  {
    icon: Sparkles,
    title: 'Inovacion',
    description:
      'Përditësojmë vazhdimisht metodologjinë dhe mjetet për një përvojë mësimore moderne dhe praktike.',
  },
]

const milestones = [
  {
    year: '2022',
    title: 'U themelua në Prishtinë',
    description: 'Ka filluar vetëm me 3 trajnime dhe 33 studentë',
  },
  {
    year: '2023',
    title: 'U trajnuan 980 studentët e parë',
    description: '90% e studentëve janë punësuar apo vetëpunësuar',
  },
  {
    year: '2024',
    title: 'Dy akreditime ndërkombëtare',
    description: 'Certifikatat tona u njohën nga institucionet evropiane',
  },
  {
    year: '2025',
    title: 'Akreditim nga Linux',
    description: 'Certifikatat tona u bënë të njohura në 163 shtete',
  },
  {
    year: '2026',
    title: 'Shtrirje në gjithë Ballkanin Perëndimor',
    description: '',
  },
]

const partners = ['Linux', 'Foleja', 'Tenton', 'Effect Media', 'Exin', 'Paysera', 'OneFor', 'TakeTuke']

export function AboutContent({ team, stats }: AboutContentProps) {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <ParticleBackground className="opacity-40" particleCount={40} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              Historia jonë
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Fuqizojmë jetën me <span className="gradient-text">dije dhe teknologji</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Mëso sot, transformo nesër! Që nga viti 2022, Tectigon Academy ka qenë në krye të edukimit në fushën e teknologjisë në Kosovë, duke fuqizuar mijëra studentë për të ndërtuar karriera të suksesshme në teknologji.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 5500, suffix: '+', label: 'Studentë të certifikuar' },
              { value: 95, suffix: '%', label: 'Punësimi' },
              { value: 18, suffix: '+', label: 'Trajnime të ofruara' },
              { value: 65, suffix: '+', label: 'Partnerë punësimi' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Misioni ynë</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Të zhvillojmë aftësi profesionale në përputhje me kërkesat reale të tregut, duke kombinuar njohuritë teorike me praktikën dhe projekte reale, në mënyrë që studentët të jenë të përgatitur për punësim, zhvillim profesional dhe vetëpunësim.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard className="h-full">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Vizioni ynë</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Të jemi ura lidhëse më e besueshme ndërmjet edukimit dhe tregut të punës, duke krijuar profesionistë konkurrues dhe të përgatitur për trendet bashkëkohore globale, me fokus në cilësi, inovacion dhe zhvillim të vazhdueshëm.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            subtitle="Çfarë na udhëheq"
            title="Vlerat tona"
            description="Parimet që udhëheqin punën dhe kulturën tonë në Tectigon Academy."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="h-full text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            subtitle="Rrugëtimi ynë"
            title="Momente kyçe"
            description="Një histori rritjeje e ndërtuar mbi cilësi, praktikë dhe rezultate konkrete."
          />

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Year Circle */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-16 h-16 rounded-full bg-card border-4 border-primary flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{milestone.year}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pl-24 md:pl-0 ${index % 2 === 0 ? 'md:pr-32 md:text-right' : 'md:pl-32'}`}>
                    <GlassCard hover={false} className="inline-block">
                      <h3 className="text-lg font-bold text-foreground mb-1">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </GlassCard>
                  </div>

                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            subtitle="Rrjeti ynë"
            title="Partnerë dhe kompani"
            description="Bashkëpunime që krijojnë mundësi reale për zhvillim dhe karrierë."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto"
          >
            {partners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-6 py-4 glass rounded-xl text-lg font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {partner}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="max-w-4xl mx-auto text-center p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Gati të bëheni pjesë e komunitetit tonë?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                Hapi i parë nis me një zgjedhje të mirë. Shfletoni trajnimet dhe gjeni programin që i përshtatet qëllimeve tuaja.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                >
                  <Link href="/courses">
                    Shiko Trajnimet <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                >
                  <Link href="/contact">
                    Na kontaktoni
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
