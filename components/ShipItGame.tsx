'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
// Type-only: erased at compile time, so `three` still arrives solely via the
// dynamic import inside start() and never lands in the initial bundle.
import type * as THREE from 'three'

type Phase = 'idle' | 'playing' | 'over'

const MAX_BREAKS = 3
const FRAME_W = 9
const GAP = 0.22

/** A page is rows of cells; each number is that cell's share of the row width. */
const THIRD = 1 / 3
const PAGES: number[][][] = [
  [[1], [1], [0.5, 0.5], [1]],
  [[1], [0.62, 0.38], [THIRD, THIRD, THIRD], [1]],
  [[0.5, 0.5], [1], [0.25, 0.25, 0.25, 0.25], [0.62, 0.38], [1]],
]

type Cell = {
  x: number
  y: number
  w: number
  h: number
  filled: boolean
  slot: THREE.Mesh
  fill: THREE.Mesh | null
}

/**
 * "Ship It" — assemble a page before the clock runs out.
 *
 * A component arrives with a given width. Put it in a slot that width fits.
 * Widths are the whole puzzle: the silhouette tells you where it belongs, so
 * nothing has to be labelled and the game reads without instructions.
 *
 * Wrong slot shakes and costs a break; three breaks ends the run. Finish a page
 * and the next one has more slots and less time.
 */
export default function ShipItGame() {
  const mount = useRef<HTMLDivElement>(null)
  const api = useRef<{ move: (d: number) => void; place: () => void; dispose: () => void } | null>(
    null,
  )

  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [breaks, setBreaks] = useState(0)
  const [pages, setPages] = useState(0)
  const [time, setTime] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem('shipit-best') ?? 0)
      if (Number.isFinite(v)) setBest(v)
    } catch {
      /* storage blocked */
    }
  }, [])

  const start = useCallback(async () => {
    if (!mount.current || loading) return
    setLoading(true)

    const THREE = await import('three')
    const host = mount.current
    if (!host) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(host.clientWidth, host.clientHeight, false)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    host.replaceChildren(renderer.domElement)

    const scene = new THREE.Scene()
    let aspect = host.clientWidth / host.clientHeight
    const view = 6.4
    const camera = new THREE.OrthographicCamera(
      -view * aspect, view * aspect, view, -view, -50, 100,
    )
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.85))
    const key = new THREE.DirectionalLight(0xffffff, 0.75)
    key.position.set(3, 6, 8)
    scene.add(key)

    const ACCENT = 0x8b5cf6
    const OUTLINE = 0x3a3a44
    const OK = 0xa78bfa

    const boxGeo = new THREE.BoxGeometry(1, 1, 0.4)

    let cells: Cell[] = []
    let group = new THREE.Group()
    scene.add(group)

    let handMesh: THREE.Mesh | null = null
    let handW = 0
    let handH = 0
    let sel = 0
    let alive = true
    let frame = 0
    let placed = 0
    let breakCount = 0
    let pageIndex = 0
    let deadline = 0
    let budget = 6000
    let shake = 0

    function clearGroup() {
      group.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.material) (m.material as THREE.Material).dispose()
      })
      scene.remove(group)
      group = new THREE.Group()
      scene.add(group)
    }

    function buildPage() {
      clearGroup()
      cells = []
      const rows = PAGES[pageIndex % PAGES.length]
      const rowH = 1.5
      const totalH = rows.length * (rowH + GAP) - GAP
      let y = totalH / 2 - rowH / 2

      rows.forEach((row) => {
        let x = -FRAME_W / 2
        row.forEach((share) => {
          const w = share * FRAME_W - GAP * (row.length - 1) / row.length
          const cx = x + w / 2
          const mat = new THREE.MeshBasicMaterial({
            color: OUTLINE,
            transparent: true,
            opacity: 0.5,
            wireframe: true,
          })
          const slot = new THREE.Mesh(boxGeo, mat)
          slot.scale.set(w, rowH, 1)
          slot.position.set(cx, y, 0)
          group.add(slot)
          cells.push({ x: cx, y, w, h: rowH, filled: false, slot, fill: null })
          x += w + GAP
        })
        y -= rowH + GAP
      })

      sel = 0
      nextPiece()
    }

    function emptyCells() {
      return cells.filter((c) => !c.filled)
    }

    function nextPiece() {
      const open = emptyCells()
      if (open.length === 0) {
        // Page complete: bank it and move on, with less time per piece.
        pageIndex += 1
        budget = Math.max(2400, budget - 700)
        setPages(pageIndex)
        buildPage()
        return
      }

      // Always solvable: the piece is sized to an actual empty slot.
      const target = open[Math.floor(Math.random() * open.length)]
      handW = target.w
      handH = target.h

      if (handMesh) {
        scene.remove(handMesh)
        ;(handMesh.material as THREE.Material).dispose()
      }
      handMesh = new THREE.Mesh(
        boxGeo,
        new THREE.MeshLambertMaterial({ color: ACCENT }),
      )
      handMesh.scale.set(handW, handH, 1)
      handMesh.position.set(0, view - 1.4, 0.6)
      scene.add(handMesh)

      sel = Math.min(sel, open.length - 1)
      deadline = performance.now() + budget
      highlight()
    }

    function highlight() {
      const open = emptyCells()
      cells.forEach((c) => {
        const mat = c.slot.material as THREE.MeshBasicMaterial
        if (c.filled) return
        mat.color.setHex(OUTLINE)
        mat.opacity = 0.5
      })
      const target = open[sel]
      if (target) {
        const mat = target.slot.material as THREE.MeshBasicMaterial
        mat.color.setHex(ACCENT)
        mat.opacity = 1
      }
    }

    function endRun() {
      alive = false
      setPhase('over')
      setBest((b) => {
        const next = Math.max(b, placed)
        try {
          localStorage.setItem('shipit-best', String(next))
        } catch {
          /* ignore */
        }
        return next
      })
    }

    function fail() {
      breakCount += 1
      setBreaks(breakCount)
      shake = 1
      if (breakCount >= MAX_BREAKS) endRun()
      else nextPiece()
    }

    function place() {
      if (!alive || !handMesh) return
      const open = emptyCells()
      const target = open[sel]
      if (!target) return

      // The width is the whole test: a component only fits its own slot size.
      if (Math.abs(target.w - handW) > 0.001) {
        fail()
        return
      }

      const fill = new THREE.Mesh(boxGeo, new THREE.MeshLambertMaterial({ color: OK }))
      fill.scale.set(target.w, target.h, 1)
      fill.position.set(target.x, target.y, 0.2)
      group.add(fill)
      target.filled = true
      target.fill = fill
      ;(target.slot.material as THREE.MeshBasicMaterial).opacity = 0

      placed += 1
      setScore(placed)
      nextPiece()
    }

    function move(d: number) {
      if (!alive) return
      const open = emptyCells()
      if (open.length === 0) return
      sel = (sel + d + open.length) % open.length
      highlight()
    }

    let lastT = performance.now()
    function loop() {
      frame = requestAnimationFrame(loop)
      const now = performance.now()
      const dt = Math.min(0.05, (now - lastT) / 1000)
      lastT = now

      if (alive) {
        const left = Math.max(0, deadline - now)
        setTime(left / budget)
        if (left <= 0) fail()
      }

      // Float the piece in hand, and glide it over the slot it is aimed at.
      const open = emptyCells()
      const target = open[sel]
      if (handMesh && target) {
        handMesh.position.x += (target.x - handMesh.position.x) * 0.18
        const restY = view - 1.4
        handMesh.position.y += (restY - handMesh.position.y) * 0.18
        handMesh.position.y += Math.sin(now * 0.004) * 0.012
      }

      if (shake > 0) {
        shake = Math.max(0, shake - dt * 3.2)
        group.position.x = Math.sin(now * 0.06) * 0.22 * shake
      } else {
        group.position.x = 0
      }

      renderer.render(scene, camera)
    }

    function onResize() {
      if (!host.clientWidth || !host.clientHeight) return
      aspect = host.clientWidth / host.clientHeight
      camera.left = -view * aspect
      camera.right = view * aspect
      camera.updateProjectionMatrix()
      renderer.setSize(host.clientWidth, host.clientHeight, false)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(host)

    function onVisibility() {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame)
        frame = 0
      } else if (!frame) {
        lastT = performance.now()
        // Do not punish someone for switching tabs mid-piece.
        deadline = performance.now() + budget
        frame = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    buildPage()
    highlight()
    setScore(0)
    setBreaks(0)
    setPages(0)
    setPhase('playing')
    setLoading(false)
    loop()

    api.current = {
      move,
      place,
      dispose: () => {
        alive = false
        if (frame) cancelAnimationFrame(frame)
        ro.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
        if (handMesh) {
          scene.remove(handMesh)
          ;(handMesh.material as THREE.Material).dispose()
        }
        clearGroup()
        boxGeo.dispose()
        renderer.dispose()
        host.replaceChildren()
      },
    }
  }, [loading])

  const restart = useCallback(() => {
    api.current?.dispose()
    api.current = null
    void start()
  }, [start])

  const quit = useCallback(() => {
    api.current?.dispose()
    api.current = null
    setPhase('idle')
    setScore(0)
    setBreaks(0)
    setPages(0)
  }, [])

  useEffect(() => () => api.current?.dispose(), [])

  useEffect(() => {
    if (phase !== 'playing') return
    function onKey(e: KeyboardEvent) {
      if (e.code === 'ArrowUp' || e.code === 'ArrowLeft' || e.code === 'KeyW') {
        e.preventDefault()
        api.current?.move(-1)
      } else if (e.code === 'ArrowDown' || e.code === 'ArrowRight' || e.code === 'KeyS') {
        e.preventDefault()
        api.current?.move(1)
      } else if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        api.current?.place()
      } else if (e.code === 'Escape') {
        quit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, quit])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/60">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <div
          ref={mount}
          className="absolute inset-0"
          onPointerDown={() => phase === 'playing' && api.current?.place()}
          role={phase === 'playing' ? 'application' : undefined}
          aria-label={phase === 'playing' ? 'Ship It game board' : undefined}
        />

        {phase === 'playing' && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
              <div>
                <p className="font-display text-3xl font-bold tabular-nums leading-none">{score}</p>
                <p className="mt-1 text-xs text-dim">
                  placed · {pages} shipped · best {best}
                </p>
              </div>
              <p className="text-xs text-dim">
                broken {breaks}/{MAX_BREAKS}
              </p>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <div className="h-1 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.round(time * 100)}%` }}
                />
              </div>
            </div>

            <div className="absolute right-4 top-16 flex gap-2">
              <button
                type="button"
                onClick={() => api.current?.move(1)}
                className="rounded-full border border-line bg-base/80 px-3 py-1.5 text-xs text-muted backdrop-blur transition-colors hover:text-fg"
              >
                Next slot
              </button>
              <button
                type="button"
                onClick={quit}
                className="rounded-full border border-line bg-base/80 px-3 py-1.5 text-xs text-muted backdrop-blur transition-colors hover:text-fg"
              >
                Exit
              </button>
            </div>
          </>
        )}

        {phase !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            {phase === 'over' ? (
              <>
                <p className="font-display text-5xl font-bold tabular-nums leading-none">{score}</p>
                <p className="max-w-[34ch] text-sm text-muted">
                  {score >= best && score > 0
                    ? `New best. ${pages} page${pages === 1 ? '' : 's'} shipped.`
                    : `Three broken layouts and the run ends. Best so far: ${best}.`}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex min-h-11 items-center rounded-full bg-accent-solid px-6 text-sm font-medium text-on-accent transition-transform duration-200 ease-expo hover:scale-[1.02]"
                  >
                    Build another
                  </button>
                  <button
                    type="button"
                    onClick={quit}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="max-w-[42ch] text-sm leading-relaxed text-muted">
                  A component arrives with a width. Move the highlight with the{' '}
                  <strong className="text-fg">arrow keys</strong> and press{' '}
                  <strong className="text-fg">space</strong> to drop it into a slot that width fits.
                  Wrong slot breaks the layout. Finish a page and the next one gets tighter.
                </p>
                <button
                  type="button"
                  onClick={() => void start()}
                  disabled={loading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent-solid px-6 text-sm font-medium text-on-accent transition-transform duration-200 ease-expo hover:scale-[1.02] disabled:opacity-60"
                >
                  {loading ? 'Loading…' : 'Start building'}
                </button>
                <p className="text-xs text-dim">
                  {best > 0 ? `Your best: ${best} placed` : 'Nothing loads until you press start'}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
