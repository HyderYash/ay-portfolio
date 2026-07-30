import type { SVGProps } from 'react'

/**
 * One icon family, one visual language: 24px grid, 1.6 stroke, round caps and
 * joins, no fills. Never use emoji as structural icons — they are font
 * dependent, uncontrollable by design tokens, and render differently per OS.
 *
 * Every icon is decorative by default (aria-hidden) because each is paired with
 * a visible text label. Pass `title` only when an icon carries meaning alone.
 */
type IconProps = SVGProps<SVGSVGElement> & { title?: string }

function Icon({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </Icon>
)

export const Mail = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
)

export const Code = (p: IconProps) => (
  <Icon {...p}>
    <path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" />
  </Icon>
)

export const Server = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="7" rx="2" />
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path d="M7 7.5h.01M7 16.5h.01" />
  </Icon>
)

export const Cloud = (p: IconProps) => (
  <Icon {...p}>
    <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.2 11.2 3.5 3.5 0 0 0 6.5 19h11Z" />
  </Icon>
)

export const Database = (p: IconProps) => (
  <Icon {...p}>
    <ellipse cx="12" cy="5.5" rx="8" ry="3" />
    <path d="M4 5.5v13c0 1.66 3.58 3 8 3s8-1.34 8-3v-13M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
  </Icon>
)

export const Sparkles = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3ZM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
  </Icon>
)

export const Gauge = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.1 9.9 18 6" />
    <path d="M3.6 17a9 9 0 1 1 16.8 0" />
  </Icon>
)

export const Layers = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17l9 5 9-5" />
  </Icon>
)

export const Terminal = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="4" width="19" height="16" rx="2" />
    <path d="m7 9 3 3-3 3M13 15h4" />
  </Icon>
)

export const Shield = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3 5 6v5.5c0 4.2 2.9 8.1 7 9.5 4.1-1.4 7-5.3 7-9.5V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
)

export const Workflow = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="6" rx="1.5" />
    <rect x="14" y="15" width="7" height="6" rx="1.5" />
    <path d="M6.5 9v4a3 3 0 0 0 3 3h4.5" />
  </Icon>
)

export const GitHub = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 19c-4.5 1.4-4.5-2.2-6.3-2.7M15.5 21v-3.4c0-1 .1-1.4-.5-2 2.4-.3 4.7-1.2 4.7-5.2a4 4 0 0 0-1.1-2.8 3.7 3.7 0 0 0-.1-2.8s-.9-.3-3 1.1a10.3 10.3 0 0 0-5.4 0C7.9 4 7 4.3 7 4.3a3.7 3.7 0 0 0-.1 2.8A4 4 0 0 0 5.8 10c0 4 2.3 4.9 4.7 5.2-.6.6-.6 1.2-.5 2V21" />
  </Icon>
)

export const LinkedIn = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7.5 10.5V17M7.5 7.2v.01M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
  </Icon>
)

export const MapPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Icon>
)

export const GraduationCap = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 4 10 5-10 5L2 9l10-5Z" />
    <path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11" />
  </Icon>
)

export const Award = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="m8.5 13.5-1 7L12 18l4.5 2.5-1-7" />
  </Icon>
)

export const Download = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5v11M7.5 10 12 14.5 16.5 10M4.5 17.5v1.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-1.5" />
  </Icon>
)
