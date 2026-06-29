'use client'

import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Edit, ImageIcon, Plus, Power, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { type AuthUser, getCurrentStaffUser } from '@/lib/auth'
import {
  createTraining,
  deleteTraining,
  formatTrainingPrice,
  getAdminTrainings,
  getTrainingImageUrl,
  type Training,
  toggleTrainingStatus,
  updateTraining,
} from '@/lib/trainings'

interface TrainingFormState {
  id: number | null
  title: string
  short_description: string
  full_description: string
  level_label: string
  training_hours: string
  students_count: string
  rating: string
  price: string
  old_price: string
  button_text: string
  is_active: boolean
  sort_order: string
  image: File | null
  image_url: string | null
}

const emptyForm: TrainingFormState = {
  id: null,
  title: '',
  short_description: '',
  full_description: '',
  level_label: '',
  training_hours: '',
  students_count: '0',
  rating: '0',
  price: '',
  old_price: '',
  button_text: 'Më shumë',
  is_active: true,
  sort_order: '0',
  image: null,
  image_url: null,
}

export function AdminTrainings() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [trainings, setTrainings] = useState<Training[]>([])
  const [form, setForm] = useState<TrainingFormState>(emptyForm)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isEditing = form.id !== null

  useEffect(() => {
    let isMounted = true

    getCurrentStaffUser()
      .then((response) => {
        if (!isMounted) return

        if (!response.user) {
          router.replace('/staff-login')
          return
        }

        setUser(response.user)
        void loadTrainings()
      })
      .catch(() => {
        if (isMounted) router.replace('/staff-login')
      })
      .finally(() => {
        if (isMounted) setIsCheckingSession(false)
      })

    return () => {
      isMounted = false
    }
  }, [router])

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const sortedTrainings = useMemo(
    () => [...trainings].sort((a, b) => a.sort_order - b.sort_order || b.id - a.id),
    [trainings],
  )

  const loadTrainings = async () => {
    setIsLoading(true)
    setError('')

    try {
      setTrainings(await getAdminTrainings())
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load trainings.')
    } finally {
      setIsLoading(false)
    }
  }

  const setField = (field: keyof TrainingFormState, value: string | boolean | File | null) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null

    if (!file) {
      setField('image', null)
      setImagePreview(form.image_url)
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Image must be JPG, PNG, or WEBP.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be 2 MB or smaller.')
      event.target.value = ''
      return
    }

    setError('')
    setField('image', file)
    setImagePreview(URL.createObjectURL(file))
  }

  const validateForm = () => {
    if (!form.title.trim()) return 'Title is required.'
    if (!form.short_description.trim()) return 'Short description is required.'
    if (!form.price || Number.isNaN(Number(form.price)) || Number(form.price) < 0) return 'Price must be a valid number.'
    if (form.training_hours && (Number.isNaN(Number(form.training_hours)) || Number(form.training_hours) < 0)) return 'Training hours must be numeric.'
    if (Number.isNaN(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 5) return 'Rating must be between 0 and 5.'
    return ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSaving(true)

    try {
      const formData = new FormData()

      if (form.id) formData.append('id', String(form.id))
      formData.append('title', form.title)
      formData.append('short_description', form.short_description)
      formData.append('full_description', form.full_description)
      formData.append('level_label', form.level_label)
      formData.append('training_hours', form.training_hours)
      formData.append('students_count', form.students_count)
      formData.append('rating', form.rating)
      formData.append('price', form.price)
      formData.append('old_price', form.old_price)
      formData.append('button_text', form.button_text)
      formData.append('is_active', form.is_active ? '1' : '0')
      formData.append('sort_order', form.sort_order)
      if (form.image) formData.append('image', form.image)

      const saved = isEditing ? await updateTraining(formData) : await createTraining(formData)

      setTrainings((current) =>
        isEditing ? current.map((training) => (training.id === saved.id ? saved : training)) : [saved, ...current],
      )
      resetForm()
      setMessage(isEditing ? 'Training updated successfully.' : 'Training created successfully.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save training.')
    } finally {
      setIsSaving(false)
    }
  }

  const startEdit = (training: Training) => {
    setForm({
      id: training.id,
      title: training.title,
      short_description: training.short_description,
      full_description: training.full_description || '',
      level_label: training.level_label || '',
      training_hours: training.training_hours?.toString() || '',
      students_count: training.students_count.toString(),
      rating: training.rating.toString(),
      price: training.price.toString(),
      old_price: training.old_price?.toString() || '',
      button_text: training.button_text,
      is_active: training.is_active,
      sort_order: training.sort_order.toString(),
      image: null,
      image_url: training.image_url,
    })
    setImagePreview(getTrainingImageUrl(training.image_url))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setForm(emptyForm)
    setImagePreview(null)
  }

  const handleToggleStatus = async (training: Training) => {
    setError('')
    setMessage('')

    try {
      const updated = await toggleTrainingStatus(training.id)
      setTrainings((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setMessage(`Training marked as ${updated.is_active ? 'active' : 'inactive'}.`)
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Could not update status.')
    }
  }

  const handleDelete = async (training: Training) => {
    const confirmed = window.confirm(`Delete "${training.title}"? This cannot be undone.`)
    if (!confirmed) return

    setError('')
    setMessage('')

    try {
      await deleteTraining(training.id)
      setTrainings((current) => current.filter((item) => item.id !== training.id))
      if (form.id === training.id) resetForm()
      setMessage('Training deleted successfully.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete training.')
    }
  }

  if (isCheckingSession) {
    return <AdminShell title="Checking session..." />
  }

  if (!user) {
    return null
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] gradient-bg pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Button asChild variant="ghost" className="mb-4 px-0 text-muted-foreground hover:text-foreground">
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Admin
            </p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Trainings</h1>
            <p className="mt-2 text-muted-foreground">
              Create and manage the training cards shown on the public website.
            </p>
          </div>

          <Button type="button" onClick={resetForm} className="self-start bg-primary text-primary-foreground md:self-auto">
            <Plus className="h-4 w-4" />
            Add new training
          </Button>
        </div>

        {(message || error) && (
          <div className={`mb-6 rounded-lg border p-4 text-sm ${error ? 'border-destructive/40 bg-destructive/10 text-destructive' : 'border-primary/40 bg-primary/10 text-primary'}`}>
            {error || message}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(360px,420px)_1fr]">
          <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {isEditing ? 'Edit training' : 'Create training'}
                </h2>
                <p className="text-sm text-muted-foreground">All public card fields are managed here.</p>
              </div>
              {isEditing && (
                <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <Field label="Title" required>
                <Input value={form.title} onChange={(event) => setField('title', event.target.value)} />
              </Field>
              <Field label="Short description" required>
                <Textarea value={form.short_description} onChange={(event) => setField('short_description', event.target.value)} />
              </Field>
              <Field label="Full description">
                <Textarea value={form.full_description} onChange={(event) => setField('full_description', event.target.value)} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Level">
                  <Input value={form.level_label} onChange={(event) => setField('level_label', event.target.value)} />
                </Field>
                <Field label="Button text">
                  <Input value={form.button_text} onChange={(event) => setField('button_text', event.target.value)} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Hours">
                  <Input type="number" min="0" value={form.training_hours} onChange={(event) => setField('training_hours', event.target.value)} />
                </Field>
                <Field label="Students">
                  <Input type="number" min="0" value={form.students_count} onChange={(event) => setField('students_count', event.target.value)} />
                </Field>
                <Field label="Rating">
                  <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setField('rating', event.target.value)} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Price" required>
                  <Input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setField('price', event.target.value)} />
                </Field>
                <Field label="Old price">
                  <Input type="number" min="0" step="0.01" value={form.old_price} onChange={(event) => setField('old_price', event.target.value)} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Sort order">
                  <Input type="number" value={form.sort_order} onChange={(event) => setField('sort_order', event.target.value)} />
                </Field>
                <div className="flex items-center justify-between rounded-md border border-border bg-background/30 px-3 py-2">
                  <span className="text-sm font-medium text-foreground">Active</span>
                  <Switch checked={form.is_active} onCheckedChange={(checked) => setField('is_active', checked)} />
                </div>
              </div>

              <Field label="Image">
                <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
              </Field>

              <div className="flex h-40 items-center justify-center overflow-hidden rounded-lg border border-border bg-background/30">
                {imagePreview ? (
                  <img src={imagePreview} alt="Training preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSaving} className="w-full bg-primary text-primary-foreground">
                {isSaving ? 'Saving...' : isEditing ? 'Update training' : 'Create training'}
              </Button>
            </div>
          </form>

          <div className="glass-card rounded-xl p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Training list</h2>
                <p className="text-sm text-muted-foreground">{sortedTrainings.length} total trainings</p>
              </div>
              <Button type="button" variant="outline" onClick={() => void loadTrainings()} disabled={isLoading}>
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Loading trainings...</p>
            ) : sortedTrainings.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No trainings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th className="py-3 pr-4 font-medium">Training</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 pr-4 font-medium">Hours</th>
                      <th className="py-3 pr-4 font-medium">Price</th>
                      <th className="py-3 pr-4 font-medium">Sort</th>
                      <th className="py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedTrainings.map((training) => {
                      const imageUrl = getTrainingImageUrl(training.image_url)

                      return (
                        <tr key={training.id}>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/10 text-primary">
                                {imageUrl ? (
                                  <img src={imageUrl} alt={training.title} className="h-full w-full object-cover" />
                                ) : (
                                  <BookOpen className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{training.title}</p>
                                <p className="text-xs text-muted-foreground">{training.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${training.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                              {training.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 pr-4 text-muted-foreground">
                            {training.training_hours ? `${training.training_hours} orë` : '-'}
                          </td>
                          <td className="py-4 pr-4 text-foreground">
                            {formatTrainingPrice(training.price)}
                          </td>
                          <td className="py-4 pr-4 text-muted-foreground">{training.sort_order}</td>
                          <td className="py-4">
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" size="icon-sm" onClick={() => startEdit(training)} aria-label="Edit training">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="outline" size="icon-sm" onClick={() => void handleToggleStatus(training)} aria-label="Toggle status">
                                <Power className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="destructive" size="icon-sm" onClick={() => void handleDelete(training)} aria-label="Delete training">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function AdminShell({ title }: { title: string }) {
  return (
    <section className="min-h-[calc(100vh-5rem)] gradient-bg pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="glass-card mx-auto max-w-md rounded-xl p-8 text-center">
          <BookOpen className="mx-auto mb-4 h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  )
}
