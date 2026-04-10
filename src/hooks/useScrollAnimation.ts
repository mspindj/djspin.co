import { useEffect, useRef } from 'react'

interface ScrollAnimationOptions {
  children?: boolean
  stagger?: number
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null)
  const { children = false, stagger = 0.08 } = options

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !ref.current) return

    const targets = children
      ? Array.from(ref.current.children) as HTMLElement[]
      : [ref.current]

    // Add the 'will-animate' class to set initial hidden state
    targets.forEach((el, i) => {
      el.classList.add('will-animate')
      el.style.transitionDelay = `${i * stagger}s`
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const els = children
              ? Array.from(entry.target.children) as HTMLElement[]
              : [entry.target as HTMLElement]
            els.forEach(el => el.classList.add('animated'))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [children, stagger])

  return ref
}
