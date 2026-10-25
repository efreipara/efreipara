// Défilement doux natif jusqu'à un élément ; décalage sous l'en-tête par son scroll-mt.
// Chromium n'interrompt pas un défilement doux lancé par script : la première action du
// visiteur (molette, toucher, clavier, clic) l'arrête là où il en est.
const userInputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const

export const useSmoothScroll = () => {
  let stopListening: (() => void) | undefined

  const abortScroll = () => {
    window.scrollTo({ top: window.scrollY, behavior: 'instant' })
    stopListening?.()
  }

  // focus : le focus suit le défilement (lecteurs d'écran, clavier), sans relancer de défilement
  const scrollToId = (id: string, { focus = false } = {}) => {
    const el = document.getElementById(id)
    if (!el) return
    stopListening?.()
    if (focus) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
    if (prefersReducedMotion()) {
      el.scrollIntoView({ block: 'start' })
      return
    }
    const onEnd = () => stopListening?.()
    userInputs.forEach((type) => addEventListener(type, abortScroll, { passive: true }))
    addEventListener('scrollend', onEnd)
    stopListening = () => {
      userInputs.forEach((type) => removeEventListener(type, abortScroll))
      removeEventListener('scrollend', onEnd)
      stopListening = undefined
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  onBeforeUnmount(() => stopListening?.())

  return { scrollToId }
}
