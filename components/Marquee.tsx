/**
 * Seamless infinite marquee. Server component — the loop is pure CSS, so this
 * costs zero JavaScript.
 *
 * The track holds the list twice and translates exactly -50%, which puts the
 * second copy where the first started at the moment it wraps. The duplicate is
 * aria-hidden so screen readers announce the list once.
 */
export default function Marquee({ items, label }: { items: string[]; label: string }) {
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <ul
      className="flex shrink-0 items-center gap-3 pr-3"
      aria-hidden={hidden ? 'true' : undefined}
    >
      {items.map((item) => (
        <li
          key={item}
          className="whitespace-nowrap rounded-full border border-line bg-surface/70 px-4 py-2 text-sm text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className="marquee relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      role="group"
      aria-label={label}
    >
      <div className="marquee-track flex w-max items-center">
        <Row />
        <Row hidden />
      </div>
    </div>
  )
}
