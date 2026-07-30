'use client'

import { useEffect, useRef } from 'react'

/**
 * Hero WebGL field.
 *
 * Perf contract — this must never be the reason a Lighthouse score drops:
 *  - `three` is imported dynamically, so it stays out of the initial JS chunk.
 *  - Nothing initialises until the canvas is actually in view AND the browser
 *    is idle, so it cannot compete with LCP.
 *  - The render loop stops when the canvas scrolls away or the tab is hidden.
 *  - prefers-reduced-motion renders exactly one static frame and never loops.
 *  - Device pixel ratio is clamped; point count drops on small viewports.
 */
export default function HeroCanvas() {
  const holder = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = holder.current
    if (!mount) return

    // Bail out entirely where WebGL is unavailable — the layout does not depend
    // on the canvas, so absence is a valid state, not a broken one.
    if (typeof window === 'undefined') return

    let disposed = false
    let cleanup: (() => void) | null = null

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    async function init() {
      const THREE = await import('three')
      if (disposed || !mount) return

      const width = mount.clientWidth
      const height = mount.clientHeight
      if (width === 0 || height === 0) return

      let renderer: import('three').WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
      } catch {
        return // No WebGL context available. Silent, non-fatal.
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.setSize(width, height, false)
      renderer.domElement.setAttribute('aria-hidden', 'true')
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.display = 'block'
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
      camera.position.z = 4.4

      // Fibonacci sphere: even point distribution with an exact, tunable count
      // (an icosahedron's vertex count explodes with detail level).
      const COUNT = width < 640 ? 1800 : 3600
      const positions = new Float32Array(COUNT * 3)
      const golden = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < COUNT; i++) {
        const y = 1 - (i / (COUNT - 1)) * 2
        const radius = Math.sqrt(Math.max(0, 1 - y * y))
        const theta = golden * i
        positions[i * 3] = Math.cos(theta) * radius * 1.5
        positions[i * 3 + 1] = y * 1.5
        positions[i * 3 + 2] = Math.sin(theta) * radius * 1.5
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const uniforms = {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uOpacity: { value: 1 },
        uSize: { value: height * 0.055 },
        uColorA: { value: new THREE.Color('#6D28D9') },
        uColorB: { value: new THREE.Color('#DDD6FE') },
      }

      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform vec2  uPointer;
          uniform float uSize;
          varying float vGlow;

          vec3 hash3(vec3 p) {
            p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
                     dot(p, vec3(269.5, 183.3, 246.1)),
                     dot(p, vec3(113.5, 271.9, 124.6)));
            return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
          }

          // Gradient noise. Runs per-vertex on a few thousand points, so the
          // cost here is negligible compared to a per-pixel equivalent.
          float gnoise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            vec3 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
                               dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                           mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
                               dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
                       mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
                               dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                           mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
                               dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
          }

          void main() {
            float n = gnoise(position * 1.35 + vec3(0.0, 0.0, uTime * 0.12));
            vGlow = n * 0.5 + 0.5;

            vec3 p = position * (1.0 + n * 0.3);

            // Pointer tilt, applied as a cheap manual rotation.
            float ax = uPointer.y * 0.35;
            float ay = uPointer.x * 0.5;
            p = vec3(p.x * cos(ay) + p.z * sin(ay), p.y, -p.x * sin(ay) + p.z * cos(ay));
            p = vec3(p.x, p.y * cos(ax) - p.z * sin(ax), p.y * sin(ax) + p.z * cos(ax));

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = uSize * (1.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3  uColorA;
          uniform vec3  uColorB;
          uniform float uOpacity;
          varying float vGlow;

          void main() {
            // Round out the point sprite and fade its edge.
            float d = length(gl_PointCoord - 0.5);
            float alpha = smoothstep(0.5, 0.02, d);
            vec3 col = mix(uColorA, uColorB, vGlow);
            gl_FragColor = vec4(col, alpha * (0.18 + vGlow * 0.6) * uOpacity);
          }
        `,
      })

      /**
       * The field has to work on both themes. Additive blending is what makes
       * the dark version glow, but on a light page additive means invisible —
       * so light mode switches to normal blending with dark, opaque points.
       */
      function applyTheme() {
        const light = document.documentElement.dataset.theme === 'light'
        uniforms.uColorA.value.set(light ? '#8B5CF6' : '#6D28D9')
        uniforms.uColorB.value.set(light ? '#3B0764' : '#DDD6FE')
        uniforms.uOpacity.value = light ? 1.9 : 1
        material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending
        material.needsUpdate = true
      }
      applyTheme()

      const themeWatcher = new MutationObserver(() => {
        applyTheme()
        renderOnce()
      })
      themeWatcher.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      // ── Pointer ────────────────────────────────────────────────────────────
      const target = { x: 0, y: 0 }
      const current = { x: 0, y: 0 }

      function onPointerMove(event: PointerEvent) {
        const rect = mount!.getBoundingClientRect()
        target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        target.y = ((event.clientY - rect.top) / rect.height) * 2 - 1
      }
      // Listen on window so the field keeps reacting past the canvas bounds.
      window.addEventListener('pointermove', onPointerMove, { passive: true })

      // ── Render loop, gated on visibility ───────────────────────────────────
      const clock = new THREE.Clock()
      let frame = 0
      let onScreen = true

      function renderOnce() {
        renderer.render(scene, camera)
      }

      function loop() {
        frame = requestAnimationFrame(loop)
        current.x += (target.x - current.x) * 0.045
        current.y += (target.y - current.y) * 0.045
        uniforms.uPointer.value.set(current.x, current.y)
        uniforms.uTime.value = clock.getElapsedTime()
        points.rotation.y += 0.0009
        renderOnce()
      }

      function start() {
        if (reduceMotion || frame) return
        frame = requestAnimationFrame(loop)
      }
      function stop() {
        if (!frame) return
        cancelAnimationFrame(frame)
        frame = 0
      }

      // Always paint one frame immediately: a tab that is backgrounded at init
      // never gets a rAF callback, and without this the canvas would stay blank
      // until it was first brought to the foreground.
      renderOnce()
      // Reduced motion stops there — one static frame, no loop.
      if (!reduceMotion) start()

      const visibility = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting
          if (onScreen && !document.hidden) start()
          else stop()
        },
        { threshold: 0 },
      )
      visibility.observe(mount)

      function onVisibilityChange() {
        if (document.hidden || !onScreen) stop()
        else start()
      }
      document.addEventListener('visibilitychange', onVisibilityChange)

      const resize = new ResizeObserver(() => {
        if (!mount) return
        const w = mount.clientWidth
        const h = mount.clientHeight
        if (w === 0 || h === 0) return
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h, false)
        uniforms.uSize.value = h * 0.055
        if (reduceMotion) renderOnce()
      })
      resize.observe(mount)

      cleanup = () => {
        stop()
        themeWatcher.disconnect()
        visibility.disconnect()
        resize.disconnect()
        document.removeEventListener('visibilitychange', onVisibilityChange)
        window.removeEventListener('pointermove', onPointerMove)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      }
    }

    // Defer until in view, then until the main thread is free.
    const gate = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        gate.disconnect()
        const idle =
          'requestIdleCallback' in window
            ? window.requestIdleCallback
            : (cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 200)
        idle(() => void init())
      },
      { rootMargin: '200px' },
    )
    gate.observe(mount)

    return () => {
      disposed = true
      gate.disconnect()
      cleanup?.()
    }
  }, [])

  return (
    <div
      ref={holder}
      // Decorative: conveys no information the text does not already carry.
      aria-hidden="true"
      /*
       * Masked and weighted to the right so it never competes with the headline.
       * On small screens it drops to a faint texture rather than sitting behind
       * body copy, which would wreck text contrast.
       */
      className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-40 [mask-image:radial-gradient(100%_100%_at_72%_45%,black_18%,transparent_70%)] lg:w-[58%] lg:opacity-80"
    />
  )
}
