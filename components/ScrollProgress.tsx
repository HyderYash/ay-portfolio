'use client'

import { useEffect, useRef } from 'react'

/**
 * Reading-progress bar. Writes a CSS custom property instead of a style width,
 * so the paint is a compositor-only transform: scaleX().
 *
 * Scroll is sampled inside requestAnimationFrame rather than on every scroll
 * event, which keeps this off the critical path during fast flicks.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let queued = false

    function update() {
      queued = false
      const el = bar.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      el.style.setProperty('--progress', String(ratio))
    }

    function onScroll() {
      if (queued) return
      queued = true
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div ref={bar} className="progress" aria-hidden="true" />
}
