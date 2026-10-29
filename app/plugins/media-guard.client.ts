// Ni menu « Enregistrer l'image » (clic droit, appui long Android) ni glisser sur les photos et la vidéo
export default defineNuxtPlugin(() => {
  const guard = (event: Event) => {
    if (event.target instanceof Element && event.target.closest('img, video, picture'))
      event.preventDefault()
  }
  document.addEventListener('contextmenu', guard)
  document.addEventListener('dragstart', guard)
})
