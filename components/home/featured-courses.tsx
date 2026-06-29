'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Clock, Users, Star, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { GlassCard } from '@/components/ui/glass-card'
import type { Course } from '@/lib/api'
import { formatDiscount, formatTrainingPrice, getTrainingImageUrl } from '@/lib/trainings'

interface FeaturedCoursesProps {
  courses: Course[]
}

export function FeaturedCourses({ courses }: FeaturedCoursesProps) {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle="Programet tona"
          title="Trajnime të veçuara"
          description="Trajnime moderne, të ndërtuara nga ekspertë dhe të orientuara drejt rezultateve reale."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const imageUrl = getTrainingImageUrl(course.imageUrl || course.image || null)
            const discountText = formatDiscount(course.price, course.originalPrice)

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div>
                  <GlassCard className="h-full flex flex-col group">
                    <div className="relative h-48 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4 overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <BookOpen className="w-16 h-16 text-primary/50" />
                      )}
                      {discountText && (
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                          {discountText}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                      {course.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.trainingHours ? `${course.trainingHours} orë` : course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.studentsEnrolled.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        {course.rating.toFixed(1)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          {formatTrainingPrice(course.price)}
                        </span>
                        {course.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatTrainingPrice(course.originalPrice)}
                          </span>
                        )}
                      </div>
                      <Link href={`/courses/${course.slug}`} className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        {course.buttonText || 'Më shumë'} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <Link
                      href={`/checkout/${course.slug}`}
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Buy / Register
                    </Link>
                  </GlassCard>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
            <Link href="/courses">
              Shiko të gjitha trajnimet
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
