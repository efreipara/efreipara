import type { GoalNames } from '~/utils/goals'
import type { SeoData } from '~/utils/seo'
import goalNames from '~/utils/goal-names.json'

// Un clic sur un lien qui sort du site envoie l'événement Plausible « <page> › <lien> »
// (ou « <zone> › <lien> ») ; la navigation interne n'est pas suivie
export default defineNuxtPlugin((nuxtApp) => {
  const { locale } = nuxtApp.$i18n
  const { redirectPaths } = useRuntimeConfig().public

  const track = (event: MouseEvent) => {
    if (event.type === 'auxclick' && event.button !== 1) return
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null
    if (!link || !isOutbound(link.getAttribute('href'), location.origin, redirectPaths)) return

    const zone = link.closest<HTMLElement>('[data-goal-zone]')?.dataset.goalZone
    // Phase de capture : chemin et titre sont encore ceux de la page quittée
    const seo = useNuxtData<SeoData>(contentKey('seo', locale.value)).data.value
    const scope = zone ?? pageGoalName(location.pathname, document.title, seo)
    const own = goalName(scope, linkLabel(link))
    // Hors langue par défaut : le nom relevé sur la page française, sinon celui de la page
    const href = link.getAttribute('href')!
    const rank = [...document.querySelectorAll(`a[href="${CSS.escape(href)}"]`)]
      .filter((other) => other.closest<HTMLElement>('[data-goal-zone]')?.dataset.goalZone === zone)
      .indexOf(link)
    const name =
      locale.value === DEFAULT_LOCALE
        ? own
        : (defaultLocaleGoalName(goalNames as GoalNames, {
            zone,
            path: delocalizePath(location.pathname.replace(/(.)\/$/, '$1')),
            href: href.startsWith('/') ? delocalizePath(href) : href,
            rank,
            key: link.getAttribute('data-goal-key'),
          }) ?? own)
    if (name) nuxtApp.$plausible?.trackEvent(name)
  }

  document.addEventListener('click', track, true)
  document.addEventListener('auxclick', track, true)
})
