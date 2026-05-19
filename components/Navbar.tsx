'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Image from 'next/image'

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/community', label: 'Community' },
  { href: '/community/rescue-stories', label: 'Rescue Stories' },
  { href: '/charities', label: 'Give' },
  { href: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-[var(--white)]/95 backdrop-blur-md shadow-card'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-xl text-[var(--charcoal)] group-hover:text-[var(--pink)] transition-colors">
            The Gentle Paws Collective
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                pathname.startsWith(link.href)
                  ? 'bg-[var(--pink)]/20 text-[var(--charcoal)]'
                  : 'text-[#6B5B52] hover:text-[var(--charcoal)] hover:bg-[var(--cream)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--pink)] to-[#E88EA8] flex items-center justify-center text-white font-display text-sm">
                  {(user.email ?? '?')[0].toUpperCase()}
                </div>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-body text-[#8B7B72] hover:text-[var(--charcoal)] transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-body text-[#6B5B52] hover:text-[var(--charcoal)] transition-colors">
                Sign in
              </Link>
              <Link href="/auth/signup" className="btn-pink text-sm !py-2 !px-5">
                Join us 🐾
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-[var(--cream)] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-1">
            <span className={`block h-0.5 bg-[var(--charcoal)] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-[var(--charcoal)] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-[var(--charcoal)] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--white)] border-t border-[#F0E8E0] px-6 py-4 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-base font-body text-[var(--charcoal)] border-b border-[#F5EDE6] last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="btn-secondary text-center">
                    My Profile
                  </Link>
                  <button onClick={handleSignOut} className="text-sm font-body text-[#8B7B72]">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-center">
                    Sign in
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="btn-pink text-center">
                    Join us 🐾
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
