import { notFound } from 'next/navigation'
import { getCourse, getCourses } from '@/lib/api'
import { CourseDetail } from '@/components/courses/course-detail'
import type { Metadata } from 'next'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(slug)
  
  if (!course) {
    return { title: 'Course Not Found' }
  }

  return {
    title: course.title,
    description: course.shortDescription,
    openGraph: {
      title: `${course.title} | Tectigon Academy`,
      description: course.shortDescription,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course) {
    notFound()
  }

  return <CourseDetail course={course} />
}
