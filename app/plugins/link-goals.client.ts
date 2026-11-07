import type { SeoData } from '~/utils/seo'

// Chaque clic sur un lien envoie l'événement Plausible « <page> › <lien> » (ou « <zone> › <lien> »)
export default defineNuxtPlugin((nuxtApp) => {
  const { data: seoData } = useNuxtData<SeoData>('seo')

  const track = (event: MouseEvent) => {
    if (event.type === 'auxclick' && event.button !== 1) return
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null
    if (!link) return

    const zone = link.closest<HTMLElement>('[data-goal-zone]')?.dataset.goalZone
    // Phase de capture : chemin et titre sont encore ceux de la page quittée
    const scope = zone ?? pageGoalName(location.pathname, document.title, seoData.value)
    const name = goalName(scope, linkLabel(link))
    if (name) nuxtApp.$plausible?.trackEvent(name)
  }

  document.addEventListener('click', track, true)
  document.addEventListener('auxclick', track, true)
})
