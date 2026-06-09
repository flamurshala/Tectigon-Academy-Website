'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const roadmapSteps = [
  {
    step: 1,
    title: 'Shfleto & Apliko',
    description: 'Zgjidh trajnimin që të përshtatet dhe dërgo aplikimin. E shqyrtojmë brenda 48 orësh.',
    icon: '01',
  },
  {
    step: 2,
    title: 'Mëso & Ndërto',
    description: 'Mëso me ligjerues ekspertë dhe ndërto projekte reale për portofolin tënd.',
    icon: '02',
  },
  {
    step: 3,
    title: 'Përfundo & Certifikohu',
    description: 'Përfundo projektin final, merr certifikimin profesional dhe bëhu pjesë e komunitetit tonë.',
    icon: '03',
  },
  {
    step: 4,
    title: 'Fillo Praktikën Profesionale',
    description: 'Fito eksperiencë reale në projekte konkrete, ndërto portfolion tënd dhe zhvillo aftësitë praktike për tu bërë gati për tregun e punës.',
    icon: '04',
  },
  {
    step: 5,
    title: 'Nise Karrierën',
    description: 'Përfito mbështetje në karrierë, lidhje me partnerë dhe mundësi reale punësimi.',
    icon: '05',
  },
]

export function RoadmapSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          subtitle="Rrugëtimi yt"
          title="Rruga drejt suksesit"
          description="Nga regjistrimi deri te punësimi, të udhëheqim hap pas hapi."
        />

        <div className="max-w-4xl mx-auto relative">
          {/* Progress Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary to-accent"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {roadmapSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start gap-6 md:gap-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Step Number Circle */}
                <motion.div
                  className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10"
                  whileInView={{ scale: [0.5, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  <div className="w-16 h-16 rounded-full bg-card border-4 border-primary flex items-center justify-center glow-primary">
                    <span className="text-xl font-bold text-primary">{step.icon}</span>
                  </div>
                </motion.div>

                {/* Content Card */}
                <div className={`flex-1 pl-24 md:pl-0 ${index % 2 === 0 ? 'md:pr-32' : 'md:pl-32'}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-2xl p-6 hover-glow"
                  >
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Empty space for alignment on desktop */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
