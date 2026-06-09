'use client'

import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const categories = [
  { value: 'all', label: 'Të gjitha' },
  { value: 'Full Stack Developer', label: 'Full Stack Developer' },
  { value: 'Graphic Design & UI/UX', label: 'Graphic Design & UI/UX' },
  { value: 'Java Development', label: 'Java Development' },
  { value: 'C# .NET', label: 'C# .NET' },
  { value: 'Cyber Security', label: 'Cyber Security' },
  { value: 'TechBlend', label: 'TechBlend' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Python Data Science', label: 'Python Data Science' },
  { value: 'Project Management & Product Ownership', label: 'Project Management & Product Ownership' },
  { value: 'WordPress & Shopify', label: 'WordPress & Shopify' },
  { value: 'Video Production', label: 'Video Production' },
  { value: '3D Modeling', label: '3D Modeling' },
  { value: 'QA', label: 'QA' },
]

const levels = [
  { value: 'all', label: 'Të gjitha nivelet' },
  { value: 'Beginner', label: 'Fillestar' },
  { value: 'Intermediate', label: 'Mesatar' },
  { value: 'Advanced', label: 'Avancuar' },
]

const sortOptions = [
  { value: 'featured', label: 'Të veçuara' },
  { value: 'popular', label: 'Më të kërkuara' },
  { value: 'rating', label: 'Vlerësimi më i lartë' },
  { value: 'price-low', label: 'Çmimi: i ulët → i lartë' },
  { value: 'price-high', label: 'Çmimi: i lartë → i ulët' },
  { value: 'newest', label: 'Më të rejat' },
]

interface CourseFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedLevel: string
  setSelectedLevel: (level: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export function CourseFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
  sortBy,
  setSortBy,
}: CourseFiltersProps) {
  const hasActiveFilters = selectedCategory !== 'all' || selectedLevel !== 'all' || searchQuery

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedLevel('all')
    setSortBy('featured')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 mb-8"
    >
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Kërko sipas titullit, aftësisë ose instruktorit..."
          className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Categories */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Category Filter */}
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Kategoria</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedCategory === category.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div className="lg:w-48">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Niveli</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {levels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="lg:w-48">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Rendit sipas</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-border"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Pastro filtrat
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
