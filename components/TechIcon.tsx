import * as si from 'simple-icons'

/**
 * Official brand marks in their official colours, from simple-icons.
 *
 * This is a server component, so the icon data never reaches the client bundle
 * — only the resulting inline SVG path does.
 *
 * Brands whose mark is monochrome black (Next.js, Express, Vercel, Java…) are
 * rendered in the current text colour instead of #000, which is both invisible
 * on a dark page and what those brands' own guidelines ask for on dark
 * backgrounds. Anything without an official mark falls back to a neutral dot.
 */
const SLUGS: Record<string, string> = {
  'React.js': 'React',
  React: 'React',
  'Next.js': 'Nextdotjs',
  'Node.js': 'Nodedotjs',
  TypeScript: 'Typescript',
  JavaScript: 'Javascript',
  'JavaScript (ES6+)': 'Javascript',
  Python: 'Python',
  Java: 'Openjdk',
  'C++': 'Cplusplus',
  C: 'C',
  MongoDB: 'Mongodb',
  MySQL: 'Mysql',
  PostgreSQL: 'Postgresql',
  Redis: 'Redis',
  Prisma: 'Prisma',
  Docker: 'Docker',
  Git: 'Git',
  'Tailwind CSS': 'Tailwindcss',
  GraphQL: 'Graphql',
  Express: 'Express',
  Fastify: 'Fastify',
  Jest: 'Jest',
  Vercel: 'Vercel',
  HTML5: 'Html5',
  CSS3: 'Css3',
  'CI/CD': 'Githubactions',
  'CI/CD (GitHub Actions)': 'Githubactions',
  'AWS (EC2, S3, IAM)': 'Amazonwebservices',
  'AWS (EC2, S3, RDS, Lambda)': 'Amazonwebservices',
  'Amazon API Gateway': 'Amazonwebservices',
  'AWS EC2': 'Amazonec2',
  'AWS S3': 'Amazons3',
  'AWS Lambda': 'Amazonwebservices',
  AWS: 'Amazonwebservices',
  FFmpeg: 'Ffmpeg',
  Stripe: 'Stripe',
}

/** Relative luminance, used only to decide "is this mark too dark to show". */
function tooDark(hex: string) {
  const n = parseInt(hex, 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.22
}

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const slug = SLUGS[name]
  type Mark = { path: string; hex: string; title: string }
  const registry = si as unknown as Record<string, Mark>
  const icon = slug ? registry[`si${slug}`] : undefined

  if (!icon) {
    // No official mark available. A neutral dot beats an invented logo.
    return (
      <span
        aria-hidden="true"
        className={`inline-block h-2 w-2 shrink-0 rounded-full bg-accent/70 ${className ?? ''}`}
      />
    )
  }

  const dark = tooDark(icon.hex)

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      // Dark marks inherit the page's text colour so they stay visible in both
      // themes; everything else keeps its real brand colour.
      style={dark ? { color: 'rgb(var(--tech-dark-fallback))' } : { color: `#${icon.hex}` }}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  )
}

export default TechIcon


/**
 * Brand colour for a technology, resolved server-side so the icon dataset never
 * ships to the browser. Marks that are officially black get a light substitute,
 * since the game renders them against a dark board.
 */
export function techColor(name: string, fallback = '#8B8B93'): string {
  const slug = SLUGS[name]
  if (!slug) return fallback
  const registry = si as unknown as Record<string, { hex: string }>
  const icon = registry[`si${slug}`]
  if (!icon) return fallback
  return tooDark(icon.hex) ? fallback : `#${icon.hex}`
}
