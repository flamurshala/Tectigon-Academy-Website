const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || process.env.NEXT_PUBLIC_API_URL || '/api'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'staff'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  error?: string
}

async function authRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${AUTH_API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!isJson) {
    throw new Error(
      'Authentication API returned a non-JSON response. Check that the PHP auth API URL is configured correctly.',
    )
  }

  if (!response.ok) {
    throw new Error(data.error || 'Authentication request failed')
  }

  return data
}

export async function loginStaff(email: string, password: string): Promise<AuthResponse> {
  return authRequest<AuthResponse>('/auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getCurrentStaffUser(): Promise<AuthResponse> {
  return authRequest<AuthResponse>('/auth/me.php')
}

export async function logoutStaff(): Promise<AuthResponse> {
  return authRequest<AuthResponse>('/auth/logout.php', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}
