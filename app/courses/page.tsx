'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { SectionHeading } from '@/components/section-heading'
import { CourseFilters } from '@/components/courses/course-filters'
import { CourseCard } from '@/components/courses/course-card'
import { Spinner } from '@/components/ui/spinner'
import { getCourses, type Course } from '@/lib/api'

export default function CoursesPage() {
  const { data: courses, isLoading } = useSWR('courses', getCourses)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  const filteredCourses = useMemo(() => {
    if (!courses) return []
    
    let filtered = [...courses]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.skills.some((skill) => skill.toLowerCase().includes(query))
      )
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        // In real app, sort by date
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return filtered
  }, [courses, searchQuery, selectedLevel, sortBy])

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <SectionHeading
            subtitle="Katalogu i trajnimeve"
            title="Shfleto programet tona"
            description="Trajnime moderne të dizajnuara nga ekspertë dhe të ndërtuara për sukses real. Gjej programin e duhur për të nisur karrierën në teknologji."
          />
        </motion.div>

        {/* Filters */}
        <CourseFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-muted-foreground"
        >
          {isLoading ? (
            <span>Duke ngarkuar trajnimet...</span>
          ) : (
            <span>
              Duke shfaqur <strong className="text-foreground">{filteredCourses.length}</strong>{' '}
              {filteredCourses.length === 1 ? 'trajnim' : 'trajnime'}
            </span>
          )}
        </motion.div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="w-8 h-8" />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Nuk u gjet asnjë trajnim</h3>
            <p className="text-muted-foreground">
              Provo të ndryshosh kërkimin ose filtrat
            </p>
          </motion.div>
        )}
      </div>
    </main>
  )
}
