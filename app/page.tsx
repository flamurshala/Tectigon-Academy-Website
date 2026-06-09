import { Hero } from '@/components/home/hero'
import { StatsSection } from '@/components/home/stats-section'
import { FeaturedCourses } from '@/components/home/featured-courses'
import { RoadmapSection } from '@/components/home/roadmap-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CTASection } from '@/components/home/cta-section'
import { getFeaturedCourses, getTestimonials, getStats } from '@/lib/api'

export default async function HomePage() {
  const [courses, testimonials, stats] = await Promise.all([
    getFeaturedCourses(),
    getTestimonials(),
    getStats(),
  ])

  return (
    <>
      <Hero />
      <StatsSection stats={stats} />
      <FeaturedCourses courses={courses} />
      <RoadmapSection />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  )
}
