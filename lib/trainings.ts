const PHP_API_BASE_URL = process.env.PHP_API_BASE_URL || 'http://localhost/Tectigon/backend/api'

export const TRAININGS_API_BASE_URL =
  typeof window === 'undefined' ? `${PHP_API_BASE_URL}/trainings` : '/backend/api/trainings'

export interface Training {
  id: number
  title: string
  slug: string
  short_description: string
  full_description: string | null
  level_label: string | null
  training_hours: number | null
  students_count: number
  rating: number
  price: number
  old_price: number | null
  currency: 'EUR'
  discount_text?: string | null
  image_url: string | null
  button_text: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface TrainingListResponse {
  success: boolean
  trainings: Training[]
  error?: string
}

interface TrainingResponse {
  success: boolean
  training: Training
  error?: string
}

interface BasicResponse {
  success: boolean
  error?: string
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    throw new Error('Training API returned a non-JSON response.')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Training request failed.')
  }

  return data
}

export async function getPublicTrainings(): Promise<Training[]> {
  const response = await fetch(`${TRAININGS_API_BASE_URL}/public-list.php`, {
    cache: 'no-store',
  })
  const data = await parseApiResponse<TrainingListResponse>(response)
  return data.trainings
}

export async function getAdminTrainings(): Promise<Training[]> {
  const response = await fetch(`${TRAININGS_API_BASE_URL}/list.php`, {
    credentials: 'include',
  })
  const data = await parseApiResponse<TrainingListResponse>(response)
  return data.trainings
}

export async function createTraining(formData: FormData): Promise<Training> {
  const response = await fetch(`${TRAININGS_API_BASE_URL}/create.php`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const data = await parseApiResponse<TrainingResponse>(response)
  return data.training
}

export async function updateTraining(formData: FormData): Promise<Training> {
  const response = await fetch(`${TRAININGS_API_BASE_URL}/update.php`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const data = await parseApiResponse<TrainingResponse>(response)
  return data.training
}

export async function deleteTraining(id: number): Promise<void> {
  const response = await fetch(`${TRAININGS_API_BASE_URL}/delete.php`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
  await parseApiResponse<BasicResponse>(response)
}

export async function toggleTrainingStatus(id: number): Promise<Training> {
  const response = await fetch(`${TRAININGS_API_BASE_URL}/toggle-status.php`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
  const data = await parseApiResponse<TrainingResponse>(response)
  return data.training
}

export function getTrainingImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return imageUrl
}

export function formatTrainingPrice(value: number): string {
  const rounded = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2)
  return `€${rounded}`
}

export function formatDiscount(price: number, oldPrice?: number | null): string | null {
  if (!oldPrice || oldPrice <= price || oldPrice <= 0) {
    return null
  }

  const discount = ((oldPrice - price) / oldPrice) * 100

  if (discount < 10) {
    const formatted = discount.toFixed(1).replace(/\.0$/, '')
    return `Kurseni ${formatted}%`
  }

  return `Kurseni ${Math.round(discount)}%`
}
