// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH.
// To point this site at the real domain, change SITE_URL below (or set
// NEXT_PUBLIC_SITE_URL in Vercel). Canonical tags, sitemap, robots.txt,
// OG/Twitter images and JSON-LD all derive from it.
// ─────────────────────────────────────────────────────────────────────────────
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ayushi-sharma.vercel.app'
).replace(/\/$/, '')

export const person: {
  name: string
  role: string
  location: string
  email: string
  linkedin: string
  portrait: string | null
  portraitAlt: string
  resumeHref: string | null
} = {
  name: 'Ayushi Sharma',
  role: 'Full-Stack Developer',
  location: 'Pune, Maharashtra, India',
  email: 'ayushisharma.atwork@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ayushi--sharma/',

  // Served from public/ayushi.jpg. Set back to null to fall back to the monogram
  // tile — the hero handles both without breaking.
  portrait: '/ayushi.jpg',
  portraitAlt: 'Ayushi Sharma, full-stack developer based in Pune, India',

  // RÉSUMÉ — null so no dead link ships. To enable: copy the PDF into public/
  // and set this to '/ayushi-sharma-resume.pdf'.
  // Note: that PDF contains her phone number, which this page deliberately
  // omits. Publishing it makes the number public. Your call.
  resumeHref: '/ayushi-sharma-resume.pdf',
}

export const meta = {
  title: 'Ayushi Sharma — Full-Stack Developer',
  // 152 chars. Kept under 160 so Google renders it whole.
  description:
    'Full-stack developer building production web applications with React, Next.js, Node.js and AWS. B.Tech Artificial Intelligence student based in Pune, India.',
  keywords: [
    'Ayushi Sharma',
    'full-stack developer',
    'React developer',
    'Next.js developer',
    'Node.js developer',
    'software engineering intern',
    'Pune developer',
    'web developer India',
  ],
} as const

export const intro = {
  headline: 'I build web applications that hold up in production.',
  body: `Full-stack developer working in React, Next.js, Node.js and AWS. I care about load time
    and about layouts that stay sane when the content doubles. I also care about the parts nobody
    sees, like clean APIs and deploys that behave. Second-year B.Tech student in Artificial
    Intelligence, looking for a software engineering internship.`,
} as const

export type SkillGroup = { label: string; items: string[] }

export const skills: SkillGroup[] = [
  { label: 'Languages', items: ['JavaScript', 'Python', 'Java', 'C++', 'C', 'SQL'] },
  { label: 'Frontend', items: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Responsive UI'] },
  { label: 'Backend & APIs', items: ['Node.js', 'REST APIs', 'API Development', 'Amazon API Gateway'] },
  { label: 'Databases & Cloud', items: ['MongoDB', 'MySQL', 'AWS (EC2, S3, IAM)', 'CI/CD', 'Git'] },
  {
    label: 'AI & Data',
    items: ['Machine Learning', 'Regression & Classification', 'Generative AI', 'Data Analytics'],
  },
]

export type Project = {
  slug: string
  name: string
  subtitle: string
  summary: string
  contributions: string[]
  stack: string[]
  href?: string
}

// Intentionally undated, matching the résumé.
export const projects: Project[] = [
  {
    slug: 'webnaut',
    name: 'Webnaut',
    subtitle: 'Conversion-focused web systems for service businesses',
    summary:
      'Client work rebuilding service business websites so they convert. Most of them already looked fine. That was the problem.',
    contributions: [
      'Built and shipped website systems end to end: frontend interfaces, backend APIs, deployment.',
      'Optimized performance, structure and scalability, and implemented AI-powered automations for client workflows.',
      'Designed backend APIs and data pipelines supporting delivery from launch through ongoing support.',
    ],
    stack: ['Next.js', 'React', 'Node.js', 'AWS'],
    href: 'https://www.webnaut.in',
  },
  {
    slug: 'lutbuilder',
    name: 'LUTBuilder.ai',
    subtitle: 'AI-powered colour grading platform',
    summary:
      'Frontend for a platform filmmakers use to build and preview colour LUTs. If the preview lags the whole tool feels broken, so most of the work went into keeping it quick.',
    contributions: [
      'Built and maintained the frontend for a platform used by filmmakers.',
      'Implemented responsive interfaces and dashboard views against a real content pipeline.',
    ],
    stack: ['Next.js', 'React'],
    href: 'https://lutbuilder.ai',
  },
  {
    slug: 'client-ml',
    name: 'Client Web & ML Applications',
    subtitle: 'Data-driven apps and predictive models',
    summary:
      'Freelance work covering full-stack delivery and applied machine learning. Some of it was the data cleaning nobody volunteers for. Some of it was the model sitting on top.',
    contributions: [
      'Built and deployed data-driven web applications with React, Node.js and MongoDB, integrating REST APIs for dynamic data workflows.',
      'Developed Python data-processing scripts and supervised ML models (regression and classification) for predictive analysis, deployed on AWS.',
    ],
    stack: ['React', 'Node.js', 'MongoDB', 'Python', 'AWS'],
  },
]

export const education = {
  degree: 'B.Tech, Artificial Intelligence',
  school: 'GH Raisoni University',
  period: 'Aug 2025 — May 2029',
} as const

export const certifications = [
  { issuer: 'AWS', name: 'Cloud Practitioner Essentials' },
  { issuer: 'AWS', name: 'Technical Essentials' },
  { issuer: 'AWS', name: 'Getting Started with DevOps on AWS' },
  { issuer: 'AWS', name: 'API Gateway for Serverless Applications' },
  { issuer: 'AWS', name: 'Introduction to Generative AI' },
  { issuer: 'Postman', name: 'API Fundamentals — Student Expert' },
  { issuer: 'Anthropic', name: 'Claude Code in Action' },
  { issuer: 'OpenAI', name: 'AI Foundations' },
] as const

export const navLinks = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#about', label: 'About' },
  { href: '#play', label: 'Play' },
  { href: '#contact', label: 'Contact' },
] as const

export type Capability = { icon: 'code' | 'server' | 'cloud'; title: string; body: string; tags: string[] }

export const capabilities: Capability[] = [
  {
    icon: 'code',
    title: 'Interfaces',
    body: 'React and Next.js front ends built out of components, responsive down to 375px. They should still make sense once the content doubles.',
    tags: ['React.js', 'Next.js', 'Responsive UI'],
  },
  {
    icon: 'server',
    title: 'APIs & data',
    body: 'Node.js services and REST endpoints over MongoDB and MySQL. I work out the data shapes before designing the screens, which saves rewriting both later.',
    tags: ['Node.js', 'REST APIs', 'MongoDB', 'MySQL'],
  },
  {
    icon: 'cloud',
    title: 'Cloud & applied AI',
    body: 'Deploying on AWS, plus supervised models for regression and classification. I reach for them where they beat something simpler and skip them where they do not.',
    tags: ['AWS', 'API Gateway', 'Machine Learning'],
  },
]

export const toolbelt = [
  'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'React.js', 'Next.js', 'Tailwind CSS',
  'Node.js', 'REST APIs', 'MongoDB', 'MySQL', 'AWS EC2', 'AWS S3', 'AWS IAM',
  'API Gateway', 'CI/CD', 'Git', 'Machine Learning', 'Generative AI',
]
