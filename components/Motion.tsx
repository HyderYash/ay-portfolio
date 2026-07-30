'use client'

import { useEffect } from 'react'

/**
 * Scroll and entrance choreography.
 *
 * GSAP is imported dynamically so it never lands in the first-load bundle.
 * The `motion-ready` class is set pre-paint by an inline script in the layout,
 * which is what actually hides `[data-reveal]` elements — so with JS disabled,
 * with reduced-motion on, or for a crawler, everything renders visible and this
 * component is a no-op.
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('motion-ready')) return

    let cancelled = false
    let ctx: gsap.Context | undefined

    /**
     * Split a heading into per-word spans so words can rise independently.
     * Done in JS rather than in the markup so the served HTML stays one clean
     * text node — crawlers and screen readers see a sentence, not word soup.
     */
    function splitWords(el: HTMLElement) {
      const text = el.textContent ?? ''
      const words = text.split(/\s+/).filter(Boolean)
      // Preserve the accessible name; the visual spans are hidden from AT.
      el.setAttribute('aria-label', text)
      el.textContent = ''
      const frag = document.createDocumentFragment()
      for (const word of words) {
        const span = document.createElement('span')
        // No overflow clip here: this heading runs at leading-[0.98], so a
        // clipping mask would slice the ascenders and descenders off. The words
        // rise and fade instead, which survives any line-height.
        span.className = 'inline-block will-change-transform'
        span.setAttribute('aria-hidden', 'true')
        span.textContent = word
        frag.appendChild(span)
        frag.appendChild(document.createTextNode(' '))
      }
      el.appendChild(frag)
      return Array.from(el.querySelectorAll<HTMLElement>('span'))
    }

    void (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])
        if (cancelled) return

        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          // ── Hero ───────────────────────────────────────────────────────────
          const heading = document.querySelector<HTMLElement>('[data-split]')
          if (heading) {
            const words = splitWords(heading)
            gsap.set(heading, { opacity: 1, y: 0 })
            gsap.from(words, {
              yPercent: 55,
              opacity: 0,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.045,
              delay: 0.05,
            })
          }

          // `from`, not `to`: the hero is already visible in the HTML, so this
          // animates it in when GSAP is present and simply never runs when it
          // is not. Nothing above the fold depends on JavaScript to appear.
          gsap.from('[data-reveal][data-hero]', {
            opacity: 0,
            y: 18,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.07,
            delay: 0.12,
          })

          // ── Everything below the fold ──────────────────────────────────────
          ScrollTrigger.batch('[data-reveal]:not([data-hero])', {
            start: 'top 88%',
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'expo.out',
                stagger: 0.06,
                overwrite: true,
              }),
          })

          // Section rules draw left-to-right as they arrive.
          gsap.utils.toArray<HTMLElement>('.rule[data-rule]').forEach((rule) => {
            gsap.to(rule, {
              scaleX: 1,
              duration: 0.9,
              ease: 'expo.out',
              scrollTrigger: { trigger: rule, start: 'top 92%' },
            })
          })

          // Stat counters tick up once, on first entry.
          gsap.utils.toArray<HTMLElement>('[data-count-to]').forEach((el) => {
            const to = Number(el.dataset.countTo)
            const decimals = Number(el.dataset.countDecimals ?? 0)
            if (Number.isNaN(to)) return
            const proxy = { value: 0 }
            gsap.to(proxy, {
              value: to,
              duration: 1.6,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
              onUpdate: () => {
                el.textContent = proxy.value.toFixed(decimals)
              },
            })
          })
        }, document.body)
      } catch {
        // Never trade content for animation: if GSAP fails to load, drop the
        // class so the hidden elements become visible again.
        root.classList.remove('motion-ready')
      }
    })()

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return null
}
