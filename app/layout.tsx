import type { Metadata, Viewport } from 'next'
import { Archivo, Space_Grotesk } from 'next/font/google'
import { SITE_URL, meta, person } from '@/lib/site'
import './globals.css'

const display = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const body = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: meta.title,
    template: '%s — Ayushi Sharma',
  },
  description: meta.description,
  keywords: [...meta.keywords],
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    firstName: 'Ayushi',
    lastName: 'Sharma',
    url: SITE_URL,
    siteName: meta.title,
    title: meta.title,
    description: meta.description,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Zoom is never disabled — maximumScale/userScalable are deliberately unset.
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090B' },
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
  ],
  colorScheme: 'dark light',
}

/** Person schema so search engines resolve who this page is about. */
function StructuredData() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: SITE_URL,
    image: `${SITE_URL}${person.portrait}`,
    jobTitle: person.role,
    email: `mailto:${person.email}`,
    sameAs: [person.linkedin],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'GH Raisoni University',
    },
    knowsAbout: [
      'Full-stack development',
      'React',
      'Next.js',
      'Node.js',
      'REST API design',
      'Amazon Web Services',
      'Machine learning',
    ],
  }

  return (
    <script
      type="application/ld+json"
      // Content is a static literal, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below intentionally adds a
    // class to <html> before React hydrates, which React would otherwise flag.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        {/*
          Runs before the rest of <body> is parsed, so it settles two things
          before the first paint: the colour theme (no flash of the wrong one)
          and whether reveal animations are armed.

          Animations are armed only when the document is actually visible. A tab
          opened in the background gets no requestAnimationFrame callbacks, so a
          reveal tween would never advance and the content would sit at opacity 0
          indefinitely. In that case we skip the choreography entirely and render
          everything plainly, which is also what happens with JS disabled or
          reduced-motion on.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: light)').matches;document.documentElement.dataset.theme=s||(m?'light':'dark');if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&document.visibilityState==='visible'){document.documentElement.classList.add('motion-ready')}}catch(e){document.documentElement.dataset.theme='dark'}",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent-solid focus:px-4 focus:py-2 focus:text-sm focus:text-on-accent"
        >
          Skip to content
        </a>
        {children}
        <StructuredData />
      </body>
    </html>
  )
}
