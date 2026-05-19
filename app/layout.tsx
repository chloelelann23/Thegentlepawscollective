import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'The Gentle Paws Collective',
    template: '%s | The Gentle Paws Collective',
  },
  description: 'Hot Girls Rescue Animals — A community of girls who rescue, rehabilitate, and rehome animals in need.',
  keywords: ['animal rescue', 'community', 'dogs', 'cats', 'gentle paws', 'hot girls rescue animals'],
  openGraph: {
    title: 'The Gentle Paws Collective',
    description: 'Hot Girls Rescue Animals',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-body bg-[var(--white)] text-[var(--charcoal)] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
