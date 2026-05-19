import Link from 'next/link'
import NewsletterWidget from './NewsletterWidget'

function PawPrintSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[var(--pink)] opacity-40">
      <ellipse cx="9" cy="8" rx="2.5" ry="3"/>
      <ellipse cx="23" cy="8" rx="2.5" ry="3"/>
      <ellipse cx="5" cy="15" rx="2.5" ry="3"/>
      <ellipse cx="27" cy="15" rx="2.5" ry="3"/>
      <path d="M16 28c-5 0-9-3.5-9-7.5S9 16 12 16h8c3 0 5 1 5 4.5S21 28 16 28z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[var(--charcoal)] text-[var(--white)] relative overflow-hidden">
      {/* Decorative paw prints */}
      <div className="absolute top-8 right-12 rotate-12 pointer-events-none">
        <PawPrintSVG />
      </div>
      <div className="absolute bottom-12 left-8 -rotate-6 pointer-events-none">
        <PawPrintSVG />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand + newsletter */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl text-[var(--white)] mb-2">
              The Gentle Paws Collective
            </h3>
            <p className="slogan text-xl text-[var(--pink)] mb-4">
              Hot Girls Rescue Animals
            </p>
            <p className="font-body text-sm text-[#B0A090] leading-relaxed max-w-xs mb-6">
              A community of girls who rescue, rehabilitate, and rehome animals in need.
              Together we make a difference, one paw at a time.
            </p>

            <NewsletterWidget />

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com/gentlepawscollective"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-body text-[#B0A090] hover:text-[var(--pink)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
                @gentlepawscollective
              </a>
            </div>
            <div className="flex gap-3 mt-2">
              <a
                href="https://tiktok.com/@thegentlepawscollective"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-body text-[#B0A090] hover:text-[var(--pink)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.27 8.27 0 004.83 1.54V7.03a4.84 4.84 0 01-1.06-.34z"/>
                </svg>
                @thegentlepawscollective
              </a>
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h4 className="font-display text-lg text-[var(--white)] mb-4">Explore</h4>
            <ul className="space-y-2">
              {[
                { href: '/events', label: 'Events' },
                { href: '/community', label: 'Community' },
                { href: '/community/rescue-stories', label: 'Rescue Stories' },
                { href: '/charities', label: 'Give' },
                { href: '/blog', label: 'Stories' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-[#B0A090] hover:text-[var(--pink)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-[var(--white)] mb-4">Join Us</h4>
            <ul className="space-y-2">
              {[
                { href: '/auth/signup', label: 'Become a Member' },
                { href: '/profile', label: 'Ambassador Program' },
                { href: '/charities', label: 'Make a Donation' },
                { href: '/community/rescue-stories/submit', label: 'Share a Story' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-[#B0A090] hover:text-[var(--pink)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-body text-[#6B5B52]">
            © {new Date().getFullYear()} The Gentle Paws Collective. Made with 💝 for the animals.
          </p>
          <p className="slogan text-sm text-[var(--pink)]">Hot Girls Rescue Animals</p>
        </div>
      </div>
    </footer>
  )
}
