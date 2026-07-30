import type { Config } from 'tailwindcss'

/** Every colour resolves through a CSS variable, which is what lets the
 *  [data-theme] switch repaint the entire site without duplicating classes. */
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: token('base'),
        surface: token('surface'),
        raised: token('raised'),
        line: token('line'),
        fg: token('fg'),
        muted: token('muted'),
        dim: token('dim'),
        accent: token('accent'),
        'accent-solid': token('accent-solid'),
        'on-accent': token('on-accent'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { shell: '68rem' },
      transitionTimingFunction: { expo: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
} satisfies Config
