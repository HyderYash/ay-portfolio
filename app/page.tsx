import Image from 'next/image'
import HeroCanvas from '@/components/HeroCanvas'
import Marquee from '@/components/Marquee'
import Motion from '@/components/Motion'
import ScrollProgress from '@/components/ScrollProgress'
import ShipItGame from '@/components/ShipItGame'
import TechIcon from '@/components/TechIcon'
import ThemeToggle from '@/components/ThemeToggle'
import {
  ArrowUpRight,
  Download,
  Award,
  Cloud,
  Code,
  GraduationCap,
  LinkedIn,
  Mail,
  MapPin,
  Server,
} from '@/components/Icons'
import {
  capabilities,
  certifications,
  education,
  intro,
  navLinks,
  person,
  projects,
  skills,
  toolbelt,
} from '@/lib/site'

function Monogram() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-raised to-surface"
      aria-hidden="true"
    >
      <span className="font-display text-6xl font-semibold tracking-tight text-line/90 sm:text-7xl">
        AS
      </span>
    </div>
  )
}

export default function Page() {
  return (
    <>
      <Motion />
      <ScrollProgress />

      <header className="sticky top-0 z-40 border-b border-line/60 bg-base/80 backdrop-blur-md">
        <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-6">
          <a
            href="#main"
            className="inline-flex min-h-11 items-center font-display text-sm font-semibold tracking-tight text-fg"
          >
            {person.name}
          </a>
          <ul className="hidden items-center gap-8 sm:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted transition-colors duration-200 hover:text-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={`mailto:${person.email}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Get in touch</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden">
          <HeroCanvas />
          <div className="shell grid gap-14 py-20 sm:py-28 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-16 lg:py-32">
            <div>
              <p data-reveal data-hero className="eyebrow">
                {person.role} · {person.location}
              </p>
              <h1
                data-split
                className="mt-5 font-display text-[clamp(2.6rem,7vw,4.6rem)] font-bold leading-[0.98] tracking-[-0.03em]"
              >
                {intro.headline}
              </h1>
              <p
                data-reveal
                data-hero
                className="mt-7 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted"
              >
                {intro.body}
              </p>
              <div data-reveal data-hero className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent-solid px-6 text-sm font-medium text-on-accent transition-transform duration-200 ease-expo hover:scale-[1.02]"
                >
                  See the work
                </a>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-6 text-sm text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  LinkedIn
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </a>
                {person.resumeHref && (
                  <a
                    href={person.resumeHref}
                    // `download` forces a save instead of handing the file to the
                    // browser's PDF viewer, which is what "one click" has to mean.
                    download="ayushi-sharma-resume.pdf"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-6 text-sm text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    <Download className="h-4 w-4 shrink-0" />
                    Download Resume
                  </a>
                )}
              </div>
            </div>

            <div data-reveal data-hero className="w-full max-w-[19rem] sm:max-w-[21rem] lg:justify-self-end">
              {/* Square box, sized by the wrapper, so the image never shifts layout. */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-surface">
                {person.portrait ? (
                  <Image
                    src={person.portrait}
                    alt={person.portraitAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 80vw, 21rem"
                    quality={90}
                    className="object-cover"
                  />
                ) : (
                  <Monogram />
                )}
              </div>
            </div>
          </div>
        </section>


        {/* ── Capabilities ──────────────────────────────────────────────────── */}
        <section className="shell py-20 sm:py-24">
          <h2 data-reveal className="eyebrow">
            What I do
          </h2>
          <div data-rule className="mt-3 rule" />

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => {
              const Glyph = cap.icon === 'code' ? Code : cap.icon === 'server' ? Server : Cloud
              return (
                <li key={cap.title} data-reveal>
                  <article className="card h-full p-6 sm:p-7">
                    <span className="icon-tile">
                      <Glyph className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">
                      {cap.title}
                    </h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{cap.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${cap.title} tools`}>
                      {cap.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-dim">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              )
            })}
          </ul>

          <div data-reveal className="mt-14">
            <Marquee items={toolbelt} label="Tools and technologies" />
          </div>
        </section>

        {/* ── Work ──────────────────────────────────────────────────────────── */}
        <section id="work" className="shell scroll-mt-24 py-20 sm:py-24">
          <h2 data-reveal className="eyebrow">
            Selected work
          </h2>
          <div data-rule className="mt-3 rule" />

          <ul className="mt-12 space-y-14 sm:space-y-16">
            {projects.map((project) => (
              <li key={project.slug} data-reveal>
                <article className="group grid gap-6 sm:grid-cols-[1fr_1.6fr] sm:gap-10">
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
                      {project.href ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-baseline gap-2 transition-colors duration-200 hover:text-accent"
                        >
                          {project.name}
                          <ArrowUpRight className="h-4 w-4 shrink-0" />
                        </a>
                      ) : (
                        project.name
                      )}
                    </h3>
                    <p className="mt-2 text-sm text-dim">{project.subtitle}</p>
                  </div>

                  <div>
                    <p className="max-w-[58ch] leading-relaxed text-muted">{project.summary}</p>
                    <ul className="mt-5 space-y-2.5">
                      {project.contributions.map((line) => (
                        <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted">
                          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${project.name} stack`}>
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-line px-3 py-1 text-xs text-dim"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Skills ────────────────────────────────────────────────────────── */}
        <section id="skills" className="shell scroll-mt-24 py-20 sm:py-24">
          <h2 data-reveal className="eyebrow">
            Technical skills
          </h2>
          <div data-rule className="mt-3 rule" />

          <dl className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.label} data-reveal>
                <dt className="font-display text-sm font-semibold tracking-tight text-fg">
                  {group.label}
                </dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-2.5">
                    {group.items.map((item) => (
                      <li key={item}>
                        <span className="tech-chip">
                          <TechIcon name={item} className="h-4 w-4 shrink-0" />
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>


        {/* ── Play ──────────────────────────────────────────────────────────── */}
        <section id="play" className="shell scroll-mt-24 py-20 sm:py-24">
          <h2 data-reveal className="eyebrow">
            Ship it
          </h2>
          <div data-rule className="mt-3 rule" />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
            <div data-reveal>
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
                Assemble a page before the clock runs out
              </h3>
              <p className="mt-4 max-w-[46ch] leading-relaxed text-muted">
                A component turns up with a width. Drop it into a slot that width fits. Put it in
                the wrong one and the layout breaks. Three breaks and you are done.
              </p>
              <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-dim">
                It loads nothing until you press Play, so it costs a passing visitor exactly zero.
              </p>
            </div>

            <div data-reveal>
              <ShipItGame />
            </div>
          </div>
        </section>

        {/* ── About ─────────────────────────────────────────────────────────── */}
        <section id="about" className="shell scroll-mt-24 py-20 sm:py-24">
          <h2 data-reveal className="eyebrow">
            About
          </h2>
          <div data-rule className="mt-3 rule" />

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div data-reveal className="space-y-5 text-[1.0625rem] leading-relaxed text-muted">
              <p>
                I started building for clients before I started my degree, so most of what I know
                came from shipping things other people relied on. Problem first, then code. I still
                work that way.
              </p>
              <p>
                The part I like most sits between the frontend and the infrastructure. How a page
                gets fast. How an API survives being changed six months later. Mostly how much you
                can delete before something breaks. I am studying artificial intelligence alongside
                that, and I use it where it beats a simpler answer.
              </p>
              <p>
                I am looking for a software engineering internship where I would be writing and
                reviewing production code with people who have been doing it longer than me.
              </p>
            </div>

            <div className="space-y-10">
              <div data-reveal>
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight">
                  <GraduationCap className="h-4 w-4 text-accent" />
                  Education
                </h3>
                <p className="mt-3 text-[0.9375rem] text-fg">{education.degree}</p>
                <p className="text-sm text-muted">{education.school}</p>
                <p className="mt-1 text-sm text-dim">{education.period}</p>
              </div>

              <div data-reveal>
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight">
                  <Award className="h-4 w-4 text-accent" />
                  Certifications
                </h3>
                <ul className="mt-3 space-y-2">
                  {certifications.map((cert) => (
                    <li key={`${cert.issuer}-${cert.name}`} className="text-[0.9375rem] text-muted">
                      <span className="text-dim">{cert.issuer}</span> — {cert.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────────────────────── */}
        <section id="contact" className="shell scroll-mt-24 py-20 sm:py-28">
          <div data-rule className="mt-3 rule" />
          <div className="mt-12" data-reveal>
            <h2 className="max-w-[24ch] font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              Open to software engineering internships.
            </h2>
            <p className="mt-6 max-w-[48ch] leading-relaxed text-muted">
              Email is the fastest way to reach me. I read everything that is not automated.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${person.email}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent-solid px-6 text-sm font-medium text-on-accent transition-transform duration-200 ease-expo hover:scale-[1.02]"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {person.email}
              </a>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-6 text-sm text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <LinkedIn className="h-4 w-4 shrink-0" />
                LinkedIn
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
              {person.resumeHref && (
                <a
                  href={person.resumeHref}
                  download="ayushi-sharma-resume.pdf"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-6 text-sm text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  Resume
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line/60 py-10">
        <div className="shell flex flex-col gap-2 text-sm text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {person.name}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {person.location}
          </p>
        </div>
      </footer>
    </>
  )
}
