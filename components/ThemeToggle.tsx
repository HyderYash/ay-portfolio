'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/**
 * Light/dark switch.
 *
 * The initial theme is resolved pre-paint by an inline script in the layout, so
 * this component never causes a flash. It only reads back what that script
 * already decided, then owns changes from there.
 *
 * Explicit choices persist. If the visitor has never chosen, the site follows
 * the OS and keeps following it when the OS changes.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? 'dark')

    const media = window.matchMedia('(prefers-color-scheme: light)')
    const onSystemChange = (event: MediaQueryListEvent) => {
      // Only track the OS while the visitor has not made a choice of their own.
      if (localStorage.getItem(STORAGE_KEY)) return
      const next: Theme = event.matches ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      setTheme(next)
    }
    media.addEventListener('change', onSystemChange)
    return () => media.removeEventListener('change', onSystemChange)
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    // Keep the browser UI (address bar, notch area) in step with the page.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'dark' ? '#09090B' : '#FAFAFA')
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode with storage blocked: the toggle still works for this visit.
    }
    setTheme(next)
  }

  // Render a stable, correctly-sized button before hydration so the header
  // never reflows. aria-hidden until the real state is known.
  const known = theme !== null
  const isDark = theme !== 'light'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={known ? !isDark : undefined}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[1.15rem] w-[1.15rem]"
        aria-hidden="true"
      >
        {isDark ? (
          // Moon: shown while dark is active, i.e. "you are in dark mode".
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  )
}
