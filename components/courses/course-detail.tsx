'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Play,
  FileText,
  Target,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { ParticleBackground } from '@/components/particle-background'
import type { Course } from '@/lib/api'

interface CourseDetailProps {
  course: Course
}

export function CourseDetail({ course }: CourseDetailProps) {
  const [expandedModule, setExpandedModule] = useState<number | null>(0)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <ParticleBackground className="opacity-40" particleCount={30} />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Kthehu te Trajnimet
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                    {course.level}
                  </span>
                  {course.certification && (
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium flex items-center gap-1">
                      <Award className="w-4 h-4" /> I certifikuar
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                  {course.title}
                </h1>

                {/* Short Description */}
                <p className="text-lg text-muted-foreground mb-6 text-pretty">
                  {course.shortDescription}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(course.rating)
                              ? 'text-primary fill-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-foreground font-medium">{course.rating}</span>
                    <span className="text-muted-foreground">({course.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {course.studentsEnrolled.toLocaleString()} students
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 mt-6 p-4 glass rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-medium text-foreground">{course.instructor}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard className="sticky top-28" hover={false}>
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-foreground">
                      ${course.price.toLocaleString()}
                    </span>
                    {course.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        ${course.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {course.originalPrice && (
                    <p className="text-sm text-primary mt-1">
                      Save ${(course.originalPrice - course.price).toLocaleString()} ({Math.round((1 - course.price / course.originalPrice) * 100)}% off)
                    </p>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    asChild
                    className="w-full bg-primary text-white hover:bg-primary/90 hover:text-[#0a0a1a] glow-primary py-6 text-lg"
                  >
                    <Link href="/register">Enroll Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full py-6">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Preview
                  </Button>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Level</span>
                    <span className="text-foreground font-medium">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Modules</span>
                    <span className="text-foreground font-medium">{course.modules.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Certificate</span>
                    <span className="text-foreground font-medium">
                      {course.certification ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* About Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  About This Course
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </motion.div>

              {/* What You'll Learn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Skills You&apos;ll Gain
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Prerequisites */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Prerequisites
                </h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq) => (
                    <li key={prereq} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Curriculum */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Course Curriculum
                </h2>
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <GlassCard
                      key={index}
                      hover={false}
                      className="overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons.length} lessons • {module.duration}
                            </p>
                          </div>
                        </div>
                        {expandedModule === index ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      {expandedModule === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-border"
                        >
                          <ul className="p-4 space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li
                                key={lessonIndex}
                                className="flex items-center gap-3 text-muted-foreground py-2"
                              >
                                <Play className="w-4 h-4 text-primary" />
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Career Outcomes */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <GlassCard hover={false}>
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Career Outcomes
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Join our 95% employment success rate</span>
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Access to 150+ hiring partner companies</span>
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Lifetime career support and mentorship</span>
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Portfolio-ready capstone project</span>
                    </li>
                  </ul>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <GlassCard hover={false}>
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Certification
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Upon successful completion, you&apos;ll receive an internationally recognized certificate from Tectigon Academy.
                  </p>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground font-medium">
                      Certificate can be verified by employers through our verification system.
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
