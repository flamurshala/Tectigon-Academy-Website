'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, Users, Star, BookOpen, ArrowRight, Award } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import type { Course } from '@/lib/api'

interface CourseCardProps {
  course: Course
  index?: number
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/courses/${course.slug}`} className="block h-full">
        <GlassCard className="h-full flex flex-col group">
          {/* Course Image Placeholder */}
          <div className="relative h-48 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4 overflow-hidden flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/50 group-hover:scale-110 transition-transform" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {course.featured && (
                <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Featured
                </span>
              )}
              {course.certification && (
                <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" /> Certified
                </span>
              )}
            </div>
            
            {course.originalPrice && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold">
                -{Math.round((1 - course.price / course.originalPrice) * 100)}%
              </div>
            )}
          </div>

          {/* Category & Level */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {course.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {course.level}
            </span>
          </div>

          {/* Course Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Course Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
            {course.shortDescription}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                {course.instructor.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{course.instructor}</span>
          </div>

          {/* Course Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.studentsEnrolled.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary fill-primary" />
              {course.rating} ({course.reviewCount})
            </div>
          </div>

          {/* Skills Preview */}
          <div className="flex flex-wrap gap-1 mb-4">
            {course.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs"
              >
                {skill}
              </span>
            ))}
            {course.skills.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{course.skills.length - 4} more
              </span>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                ${course.price.toLocaleString()}
              </span>
              {course.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${course.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Course <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  )
}
