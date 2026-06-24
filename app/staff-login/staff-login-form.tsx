'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginStaff } from '@/lib/auth'

export function StaffLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await loginStaff(email, password)
      router.replace('/admin/dashboard')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden gradient-bg pt-32 pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-28 h-px w-2/3 -translate-x-1/2 bg-primary/30" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-md"
        >
          <div className="glass-card rounded-xl p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Staff Login</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to continue to the admin dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="staff-email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="staff-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    disabled={isLoading}
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="staff-password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="staff-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="min-h-6" aria-live="polite">
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
