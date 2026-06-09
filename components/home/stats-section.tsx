'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, BookOpen, Building2, Award } from 'lucide-react'
import { AnimatedCounter } from '@/components/animated-counter'
import type { Stats } from '@/lib/api'

const statIcons = {
  studentsGraduated: GraduationCap,
  employmentRate: Briefcase,
  coursesOffered: BookOpen,
  yearsExperience: Award,
  partnerCompanies: Building2,
}

const statLabels = {
  studentsGraduated: 'Të diplomuar',
  employmentRate: 'Shkalla e punësimit',
  coursesOffered: 'Trajnime të ofruara',
  yearsExperience: 'Vite eksperience',
  partnerCompanies: 'Kompani partnere',
}

interface StatsSectionProps {
  stats: Stats
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statEntries = [
    { key: 'studentsGraduated', value: stats.studentsGraduated, suffix: '+' },
    { key: 'employmentRate', value: stats.employmentRate, suffix: '%' },
    { key: 'coursesOffered', value: stats.coursesOffered, suffix: '+' },
    { key: 'yearsExperience', value: stats.yearsExperience, suffix: '' },
    { key: 'partnerCompanies', value: stats.partnerCompanies, suffix: '+' },
  ] as const

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statEntries.map(({ key, value, suffix }, index) => {
            const Icon = statIcons[key]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center group hover-glow"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  <AnimatedCounter 
                    value={value} 
                    suffix={suffix}
                    duration={2}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {statLabels[key]}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
