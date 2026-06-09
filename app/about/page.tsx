import { getTeam, getStats } from '@/lib/api'
import { AboutContent } from '@/components/about/about-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rreth Nesh',
  description:
    'Njihuni me Tectigon Academy: misioni, ekipi dhe përkushtimi ynë për trajnime cilësore dhe aftësi praktike për tregun e punës.',
}

export default async function AboutPage() {
  const [team, stats] = await Promise.all([
    getTeam(),
    getStats(),
  ])

  return <AboutContent team={team} stats={stats} />
}
