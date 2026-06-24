'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, ShieldCheck, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type AuthUser, getCurrentStaffUser, logoutStaff } from '@/lib/auth'

export function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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
      })
      .catch(() => {
        if (isMounted) {
          router.replace('/staff-login')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [router])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logoutStaff()
    } finally {
      router.replace('/staff-login')
    }
  }

  if (isCheckingSession) {
    return (
      <section className="min-h-[calc(100vh-5rem)] gradient-bg pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="glass-card mx-auto max-w-md rounded-xl p-8 text-center">
            <ShieldCheck className="mx-auto mb-4 h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">Checking admin session...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!user) {
    return null
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] gradient-bg pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Admin
            </p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Welcome back, {user.name}. This area is ready for future staff tools.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="self-start border-border bg-card/60 hover:bg-muted md:self-auto"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass-card rounded-xl p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Protected Area</h2>
                <p className="text-sm text-muted-foreground">
                  Authenticated staff and admin users only.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background/30 p-5">
              <p className="text-sm leading-6 text-muted-foreground">
                Product, course, payment, and content management modules can be added here
                later. The login, session validation, and logout flow are ready.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Signed In</h2>
            </div>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="mt-1 font-medium text-foreground">{user.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="mt-1 break-all font-medium text-foreground">{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd className="mt-1 font-medium capitalize text-foreground">{user.role}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
