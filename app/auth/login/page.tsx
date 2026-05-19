'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirect)
    }
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--cream)] via-[var(--white)] to-[#FFF0F5] px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md p-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[var(--charcoal)] mb-2">Welcome back</h1>
          <p className="slogan text-xl text-[var(--pink)]">Hot Girls Rescue Animals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />

          {error && (
            <p className="text-sm font-body text-[var(--red)]">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#F0E8E0]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--white)] px-3 font-body text-[#B0A090]">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          className="btn-secondary w-full flex items-center justify-center gap-3"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
            <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2c-.72.49-1.63.78-2.7.78-2.07 0-3.82-1.4-4.44-3.28H1.87v2.07A8 8 0 008.98 17z" fill="#34A853"/>
            <path d="M4.54 10.56A4.8 4.8 0 014.3 9c0-.54.1-1.06.25-1.56V5.37H1.87A8 8 0 001 9c0 1.3.3 2.53.87 3.63l2.67-2.07z" fill="#FBBC05"/>
            <path d="M8.98 3.58c1.16 0 2.2.4 3.02 1.18l2.26-2.26A8 8 0 001.87 5.37L4.54 7.44c.62-1.88 2.37-3.86 4.44-3.86z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm font-body text-[#8B7B72] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[var(--charcoal)] font-medium hover:text-[var(--pink)] transition-colors">
            Join the Collective
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#F2A0B4] border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
