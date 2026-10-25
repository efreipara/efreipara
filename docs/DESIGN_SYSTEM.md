# Efrei Para — Design system

> **Périmètre** : apparence et règles visuelles communes — thème, couleurs, polices, icônes, motifs récurrents, composants réutilisables.
> **À mettre à jour** dès qu'une couleur, une police, une règle visuelle transverse ou un composant réutilisable est ajouté, modifié ou supprimé.
> Le contenu de chaque page est dans [PRD.md](PRD.md).

## Principes

- **Clair et sombre** : les deux thèmes sont soignés. Le thème suit le système, le visiteur peut basculer (`HeaderColorModeButton`), choix gardé en `sessionStorage` (`colorMode` dans `nuxt.config.ts`). Toute couleur posée en dur se vérifie dans les deux thèmes.
- **Identité du club** : bleu nuit Efrei Para, une couleur par activité, police de titre « course », parachutes qui tombent en décor.
- **Nuxt UI d'abord** : composants Nuxt UI (`UHeader`, `UFooter`, `UPageHero`, `UPageCTA`, `UCard`, `UAccordion`, `UCarousel`, `UTimeline`…) ; un composant maison ne se justifie que si Nuxt UI n'a pas d'équivalent. Vérifier props et slots avec le MCP Nuxt UI avant de s'en servir.
- **Interface 100 % en français**, dates formatées en `fr-FR` (`Intl.DateTimeFormat`, `toLocaleDateString`).
- **Mobile d'abord** : public étudiant, souvent sur téléphone ; tout se vérifie aussi en desktop.

## Thème

Défini dans [`app/app.config.ts`](../app/app.config.ts) et [`app/assets/css/main.css`](../app/assets/css/main.css).

| Rôle               | Valeur                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Couleur primaire   | `navy` : palette maison de 50 à 950 par pas de 50, dérivée de `#092954`, en OKLCH                                                         |
| Secondaire         | `blue`                                                                                                                                    |
| Neutre             | `slate`                                                                                                                                   |
| Fond, texte, bords | variables `--ui-bg*`, `--ui-text*`, `--ui-border*` surchargées pour `:root` (clair, tons navy et slate) et `.dark` (fonds navy 750 → 900) |
| `theme-color`      | `seo.yml` (`defaults.themeColor`)                                                                                                         |
| Rayon              | celui de Nuxt UI ; formes arrondies par convention (voir ci-dessous)                                                                      |

### Couleurs de marque (`@theme` de `main.css`)

| Variable                                                                        | Usage                                                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `--color-efreipara`                                                             | bleu Efrei Para `#092954` (= `navy-700`), logo en thème clair                                    |
| `--color-efreipara-background`                                                  | bleu nuit `#010521`, fond de la page QR                                                          |
| `--color-efreipara-<activité>`                                                  | `oa` violet `#9680dd`, `tandem` or `#d2b841`, `soufflerie` rose `#d370c3`, `pac` rouge `#c3042d` |
| `--color-on-efreipara-<activité>`                                               | texte lisible sur la couleur pleine (noir pour `tandem`, blanc sinon)                            |
| `--color-efrei`                                                                 | bleu Efrei `#377fbc`                                                                             |
| `--color-discord`, `-instagram`, `-facebook`, `-linkedin`, `-github` (+ `on-*`) | couleurs des réseaux (bandeau Discord de `/rejoindre`…)                                          |
| `--color-headline`                                                              | `#afbae0`                                                                                        |

Chaque couleur a sa valeur hexadécimale d'origine en commentaire ; la conversion se fait sur oklch.com. Tailwind génère les utilitaires (`bg-efreipara-oa`, `text-discord`…).

Utiliser les couleurs sémantiques de Nuxt UI (`text-muted`, `text-toned`, `text-highlighted`, `bg-elevated`, `bg-muted`, `border-default`, `primary`…) plutôt que des teintes Tailwind en dur. Seule exception : le nom d'un partenaire sans logo, en `text-gray-700` sur la tuile blanche (`bg-white`) des logos, identique dans les deux thèmes.

## Polices

Servies localement par `@nuxt/fonts` (fichiers `woff2` de `public/`, fournisseur Google désactivé).

Les déclarations `@font-face`, avec des polices de repli aux métriques ajustées (contre le décalage de mise en page), sont injectées dans chaque page HTML. Une police introuvable fait échouer le build. Outfit est une police variable : sa plage `100 900` est déclarée sur la famille (`nuxt.config.ts`), et le fournisseur local la trouve par le nom du fichier (`outfit-100-900-latin.woff2`).

| Police              | Usage                                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Outfit**          | texte (`font-family` de `:root`), graisses 100 à 900                                                                                                                   |
| **Racing Sans One** | titres : classe `font-title` (titres de section, cartes de la galerie, chiffres), `ui.title` des `UPageHero` / `UPageCTA`, titres des pages légales (`.legal-content`) |
| **Open Dyslexic**   | option d'accessibilité : remplace toutes les polices, titres compris (`html.a11y-dyslexic`), `font-size-adjust: 0.45`                                                  |

## Icônes

- **Tabler** (`tabler:*`) pour tout ; **Simple Icons** pour les logos de marques ; collections maison pour les logos Efrei Para, Efrei, iFly et Creative Commons, et pour les icônes d'activité (`activite:*`).
- Icônes d'activité : dessinées au gabarit Tabler pour s'y fondre : `viewBox` 24 × 24, tracés entre 2 et 22, attributs `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"` sur un `<g>`, peu de formes, lisibles à 14 px. Tandem : voile et deux personnes ; OA : deux voiles en diagonale, une petite au loin et une grande devant avec son parachutiste ; soufflerie : volant entre les parois du tunnel, air qui monte ; PAC : une personne seule sous sa voile, mains aux commandes.
- Les icônes génériques de Nuxt UI (flèches, fermer, chargement, clair / sombre…) sont remappées en Tabler : dans le code, `appConfig.ui.icons.<nom>`.
- Les icônes propres au site sont des champs du contenu, dans le fichier de la page ou du composant qui les affiche (`contact.yml`, `navigation.yml`, `galerie.yml`, `qr.yml`, `labels.yml`…) ; celle d'une activité est le champ `icon` de son fichier, lue par `getIcon(type)` de `useActivities()`, celle d'un réseau vient de `club.yml`. Une icône déjà rangée ne s'écrit pas en dur.

## Règles transverses

### Teinte d'activité

Tout élément lié à une activité prend sa couleur par une **teinte transparente** de la variable CSS de l'activité. La teinte se pose en CSS, ce qui permet de la passer dans les `class` et `ui` des composants Nuxt UI :

```vue
<div :class="activityClass('tandem')">
  <!-- activity-tandem : --activity: var(--color-efreipara-tandem) -->
  <div class="bg-tint-10 hover:bg-tint-12"><UIcon class="text-activity" /></div>
</div>
```

- `activityClass(type)` (`app/utils/activities.ts`) donne la classe `activity-<clé>`, qui pose `--activity` ; elle se met une fois, sur la carte ou la section, et les descendants lisent la variable. C'est une classe et non un `style` : un composant Nuxt UI avec lien (`UPageCard :to`…) envoie ses attributs, `style` compris, au lien et pas à la racine, alors que `class` va bien à la racine. Les classes sont générées par `@source inline(...)` dans `main.css` (voir [Ajouter une activité](CONTENT.md#ajouter-une-activité)).
- Utilitaires de `main.css` : `bg-tint-<pourcentage>`, `border-tint-<pourcentage>` et `ring-tint-<pourcentage>` (`color-mix` avec du transparent), `text-activity` et `bg-activity` (couleur pleine), `text-activity-strong` (texte : couleur assombrie en clair et éclaircie en sombre, pour atteindre 4,5:1), `text-on-activity` (texte sur `bg-activity` : noir sur les teintes claires, blanc sur le rouge de la PAC). Ils acceptent les variantes Tailwind (`hover:`, `dark:`, `group-hover:`). Sans `--activity`, ils retombent sur `var(--ui-primary)`.
- Fond d'une pastille d'icône : 10 à 15 % ; fond d'une carte de point fort : 8 % ; survol d'une carte ou d'un menu : 10 à 12 % ; bannière d'événement : 10 % en clair, 18 % en sombre (bordure 20 / 35 %).
- L'icône prend la couleur pleine (`text-activity`), le texte `text-activity-strong`.
- Le survol teinté est une classe `hover:bg-tint-…` : pas d'état JavaScript.
- `activityColor(type)` et `activityTint(type, %)` donnent les mêmes valeurs en JavaScript, pour un style qu'aucune classe ne couvre.
- La correspondance clé → variable est la table `ACTIVITY_CSS_VAR` de `app/utils/activities.ts` ; une clé inconnue retombe sur `var(--ui-primary)`.

Les catégories de Documents et FAQ utilisent à la place six couleurs Tailwind (`useCategoryColor`) : fond `/10`, icône `-500`, survol `/20` ; le texte des pastilles est en `-700` ou `-800` en clair et `-400` en sombre (`categoryTextClass`), pour le contraste.

### Sections

Règle commune à tout le site (hors page QR, page d'erreur et pages de redirection, qui ont leur propre mise en scène).

- Toute section est une `SharedSection` (`UPageSection` + surtitre) : surtitre court en capitales espacées précédé d'un trait (`SharedHeadline`, couleur primaire, ou icône et teinte d'une activité), titre en Racing Sans One **aligné à gauche**, description `text-muted` de largeur `max-w-2xl`. Le centrage est l'exception (appel à l'action). Réglage global : `ui.pageSection` dans `app.config.ts`.
- Page d'activité : `ActivitePage` calcule l'alternance des bandes à partir des seules sections présentes (prop `band` de chaque section) ; surtitres dans la teinte de l'activité (`headlineTone="text-activity-strong"`), icône de l'activité à la place du trait sur `/activites`.
- Une section verticale avec un lien (« Voir toute la galerie ») le place à droite du titre sur grand écran.
- Rythme : `py-12` sur téléphone, `py-20` en `sm`, `py-24` en `lg` ; les sections se distinguent par l'alternance de fond (prop `band` : `bg-elevated/60`), pas par des bordures ou des séparateurs. Seules exceptions : le filet au-dessus de l'appel à l'action (qui suit tantôt une bande, tantôt un fond clair) et celui du pied de page.
- Les photos réelles portent la page : cartes d'activité à photo, photo de groupe à côté des points forts, derniers albums. La pastille d'icône est réservée à ce qui est lié à une activité ou à une catégorie.

### Formes

- Boutons : rôles et formes dans [Boutons](#boutons).
- Pastille d'icône : carré `size-8` à `size-14`, `rounded-xl` ou `rounded-2xl`, icône centrée à environ la moitié de la taille.
- Cartes : `UPageCard` (ou `UCard` sans lien) `variant="subtle"`, `rounded-2xl`, photo en tête (`#header`) quand elle existe ; images `rounded-lg` à `rounded-2xl`.
- Carte cliquable : `UPageCard :to` (le composant pose le lien sur toute la carte, avec le focus visible ; son nom accessible est le `title`). La mise en page se règle par `ui` (`wrapper: 'flex-row'` pour une pastille à gauche) et les slots `#leading`, `#header`, `#body`.
- Point fort (pastille + titre + texte) : `UPageFeature`, pastille réglée par `ui.leading` / `ui.leadingIcon`, `text-wrap` sur le titre et la description (Nuxt UI met `text-pretty`). Section image + texte + points forts + bouton : `UPageSection orientation="horizontal"` (`/activites`).

### Boutons

Chaque bouton a un **rôle**, porté par une variante de `UButton` définie dans `app.config.ts` (`ui.button.variants.variant`, tailles dans `compoundVariants`). Le rôle se choisit d'après ce que le bloc attend du visiteur, pas d'après l'apparence voulue. Forme par défaut : `rounded-md` ; `cursor-pointer` et focus visible (contour `outline-inverted` décalé de 2 px) réglés pour toutes les variantes.

| Rôle       | Variante    | Apparence                                                                                           | Exemples                                                                                                                              |
| ---------- | ----------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Principal  | `primary`   | plaque pleine `bg-inverted` inclinée de 12°, libellé en Racing Sans One redressé ; un seul par bloc | « Nous rejoindre » (héros, appel à l'action), « Inscription » (bannière), « Envoyer un e-mail », « Retour à l'accueil », redirections |
| Secondaire | `secondary` | texte `font-semibold` souligné du trait des surtitres, qui s'étire sous tout le libellé au survol   | « Voir nos activités », liens de section, réseaux de Contact, encadré d'aide, boutons de la FAQ                                       |
| Lien       | `tertiary`  | comme le secondaire, en `text-muted`                                                                | « En savoir plus » (bannière), « Signaler l'erreur »                                                                                  |
| Utilitaire | `utility`   | contour fin `ring-inverted/30`, sans fond                                                           | itinéraires et support de Contact                                                                                                     |
| Filtre     | `filter`    | pastille inclinée à contour fin ; active (`aria-pressed`) : fond plein                              | filtres de la galerie, pastilles de catégories de Documents et de la FAQ                                                              |
| Icône      | `ghost`     | carré `p-2`, `aria-label` obligatoire ; plein (`solid`) pour un état actif (menu d'accessibilité)   | en-tête, pied de page, fermeture de la bannière, vidéo de l'accueil, page QR                                                          |

- Le principal et les filtres sont inclinés (`-skew-x-12`) et leur contenu redressé (`*:skew-x-12`) : libellé passé par la prop `label`, jamais par le slot par défaut (un nœud texte ne se redresse pas).
- Sur la vidéo de l'accueil : principal blanc (`bg-white text-navy-950`) et secondaire en texte blanc, dans les deux thèmes. Flèches du carrousel : `solid`, `rounded-md`.
- Teinte d'activité ou couleur de catégorie passée en `class` (Nuxt UI fusionne les classes avec `tailwind-merge`, elles remplacent celles de la variante) : secondaire de `/activites` en `text-activity-strong` ; filtre d'activité en `text-activity-strong ring-tint-45`, actif en `bg-activity text-on-activity`.
- Le rôle d'un bouton du contenu (`hero.links`, `cta.links`) se règle par son champ `variant` ([CONTENT.md](CONTENT.md)).

### Appui

- Tout élément pressable s'enfonce légèrement à l'appui : `active:scale-[0.97]` pour les boutons (réglé pour tous les `UButton` dans `app.config.ts`, `ui.button.slots.base`) et pour le logo et les liens du menu de l'en-tête (`ui.title` de `UHeader`, `ui.link` de `UNavigationMenu`), `active:scale-[0.98]` pour les cartes et les éléments larges (`ui.root` des `UPageCard`, albums de la galerie, tuiles du sous-menu « Nos activités », lignes du menu mobile). Associer `transition` (et non `transition-colors`) pour que l'enfoncement soit animé.
- Transition de 150 à 200 ms qui inclut `scale` (`transition`, ou `transition-transform` sur un lien simple). Les effets de survol Tailwind ne s'appliquent qu'aux appareils à pointeur : rien ne reste bloqué après un appui sur mobile.

### Liens et survol

- Lien interne vers une autre page : flèche `arrowRight` qui glisse de `0.5` au survol (`group-hover:translate-x-0.5`).
- Lien externe : icône `external`, ouverture dans un nouvel onglet.
- Image d'une carte cliquable : léger zoom au survol (`group-hover:scale-105`, 500 ms).

### Héros de page

- Page de premier niveau : `SharedPageHero`, en-tête compact (`UPageHeader`, réglé dans `app.config.ts`) sur bande `bg-elevated/60`, aligné à gauche : surtitre (`SharedHeadline`), titre `h1` en `font-title` (`text-4xl sm:text-5xl`), description `max-w-2xl`. Le contenu de la page suit avec `py-12 sm:py-16`.
- Activité : `ActiviteHero`, même principe avec la photo de l'activité et une mise en page horizontale.
- Accueil : `HomeHero`, vidéo plein écran assombrie (`bg-black/30`).
- Le titre, la description et le badge entrent par le bas en décalé : classe `hero-slide-up` (0,5 s, 16 px, ease-out marqué) avec `animation-delay` de 0,05 s, 0,12 s, 0,2 s (en-tête des pages : 0,05 s, 0,08 s, 0,14 s ; accueil : 0,05 s, 0,15 s, 0,25 s). Le contenu doit être lisible dans les 300 ms qui suivent un clic.

### Décor de parachutes

`SharedParachuteBg` fait tomber des icônes `efreipara-parachute` en arrière-plan (position absolue, sans interaction, `aria-hidden`). Paramètres : nombre, couleur (et couleur en sombre), vitesse, tailles, dérive, part déjà visible au chargement. Les parachutes sont tirés au sort au montage : ils ne sont pas dans le HTML prérendu. Utilisé sur l'appel à l'action, la page d'erreur et la page QR.

### Mouvement

- Changement de page : fondu de 150 ms (`pageTransition`, `out-in`).
- Bascule clair / sombre : View Transition en cercle depuis le bouton ; le hero d'accueil en est exclu (`view-transition-name: home-hero`).
- Bannière d'événement : s'ouvre en hauteur (grille `0fr` → `1fr` avec fondu, 300 ms à l'ouverture, 200 ms à la fermeture, ease-out marqué) ; la page descend avec elle au lieu de sauter.
- Filtres de la galerie : la nouvelle grille apparaît en fondu (200 ms, ease-out) ; l'ancienne disparaît aussitôt, un nouveau clic est pris en compte sans attendre.
- Vidéo de l'accueil : lancée au montage, sauf avec « réduire les animations » ; bouton pause / lecture en bas à droite.
- Carrousel des activités : défile seul toutes les 3 s, s'arrête au survol et à la première interaction ; aucun défilement automatique avec « réduire les animations » (activé seulement au montage, après lecture du réglage).
- Pastilles de catégories et sommaire des pages légales (`useSmoothScroll`) : défilement natif (`scrollIntoView`), arrêté net par la première action du visiteur (molette, toucher, clavier, clic : Chromium ne le fait pas de lui-même) ; immédiat avec « réduire les animations ». Le décalage sous l'en-tête vient du `scroll-mt` des sections.
- `prefers-reduced-motion` : une règle globale de `main.css` rend animations et transitions CSS quasi instantanées ; les compteurs de l'accueil affichent directement leur valeur et la bascule de thème se fait sans View Transition (`prefersReducedMotion`). `SharedParachuteBg` réduit en plus l'opacité de ses parachutes.

### Accessibilité

- Options du visiteur : classes `a11y-dyslexic` et `a11y-highContrast` posées sur `<html>` par `app.vue`.
- **Contraste élevé** : `filter: contrast(1.5)` sur toute la page, compensé (`contrast(0.667)`) sur les `img` et `video`. La classe `no-contrast` épargne de la même façon d'autres éléments (logos partenaires, voile du hero).
- Boutons d'icône seuls : toujours un `aria-label` en français. Images décoratives : `alt=""` et `aria-hidden="true"`.

### Grilles

Grilles Tailwind simples, une colonne sur téléphone : 2 colonnes à partir de `sm` (cartes, documents), 3 en `lg` (galerie, points forts), 4 en `lg` (chiffres d'activité). Contenu dans `UContainer`, rythme et bandes de la règle commune (voir [Sections](#sections)) ; contenu placé directement sous un en-tête de page : `py-12 sm:py-16`. Cartes d'activité de l'accueil sur 1, 2 puis 4 colonnes (photo 16/9, puis 4/5 en `lg`) ; catégories de Documents et FAQ espacées de `gap-16 sm:gap-20`.

## Composants réutilisables

Avant d'écrire un composant, vérifier qu'aucun de ceux-ci ne répond au besoin.

| Composant                                                                                                                                             | Rôle                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppHeader`                                                                                                                                           | En-tête : logo, menu Activités, liens, réseaux, accessibilité, thème, menu mobile                                                                                                                                      |
| `AppFooter`                                                                                                                                           | Pied de page : colonnes de navigation, licences, réseaux                                                                                                                                                               |
| `AppEventBanner`                                                                                                                                      | Bannière du prochain événement (`UBanner` sans `id` : fermeture et `sessionStorage` gérées par le composant), teintée par l'activité, fermable                                                                         |
| `HeaderBurgerButton`                                                                                                                                  | Bouton du menu mobile, icônes menu / fermer animées                                                                                                                                                                    |
| `HeaderColorModeButton`                                                                                                                               | Bascule clair / sombre avec transition en cercle                                                                                                                                                                       |
| `HomeHero`                                                                                                                                            | Hero vidéo plein écran de l'accueil                                                                                                                                                                                    |
| `HomeStatCounter`                                                                                                                                     | Nombre qui défile jusqu'à sa valeur quand il devient visible (suffixe conservé)                                                                                                                                        |
| `ActivitePage`                                                                                                                                        | Assemble les sections d'une page d'activité selon le contenu présent                                                                                                                                                   |
| `ActiviteHero`, `ActiviteStats`, `ActiviteIntro`, `ActiviteCarousel`, `ActiviteFeatures`, `ActiviteSteps`, `ActiviteRequirements`, `ActivitePartners` | Sections d'une page d'activité, teintées par l'activité                                                                                                                                                                |
| `SharedHeadline`                                                                                                                                      | Surtitre du site : trait (ou icône) et texte en capitales, balise au choix (`as`) ; sections, en-têtes de page, catégories, blocs de Contact                                                                           |
| `SharedSection`                                                                                                                                       | Section commune : `UPageSection` avec surtitre à trait, liens à droite du titre, bande de fond (`band`)                                                                                                                |
| `SharedAlbumCard`                                                                                                                                     | Carte d'album (couverture ou photo de repli du CDN, squelette, type, date, lieu, lien externe) : galerie, accueil                                                                                                      |
| `SharedPageHero`                                                                                                                                      | En-tête compact des pages intérieures : surtitre, titre `h1`, description, sur bande                                                                                                                                   |
| `SharedCallToAction`                                                                                                                                  | Appel à l'action de bas de page (collection `cta`) sur fond de parachutes                                                                                                                                              |
| `SharedCategoryChips`                                                                                                                                 | Pastilles de catégories qui font défiler jusqu'à la section (Documents, FAQ)                                                                                                                                           |
| `SharedCategoryHeader`                                                                                                                                | En-tête d'une catégorie (Documents, FAQ) : nombre d'éléments en surtitre dans la couleur de la catégorie, titre `h2`, description                                                                                      |
| `SharedHelpCta`                                                                                                                                       | Encadré d'aide en `UPageCTA` subtle, aligné à gauche : icône et titre, description, boutons Discord / Instagram / GitHub                                                                                               |
| `SharedPartnerLogos`                                                                                                                                  | Logos partenaires sur tuiles blanches, liens externes nommés (accueil, pages d'activité)                                                                                                                               |
| `SharedParachuteBg`                                                                                                                                   | Décor de parachutes qui tombent                                                                                                                                                                                        |
| `LegalPage`                                                                                                                                           | Page légale : en-tête compact, texte Markdown sur 7 colonnes et sommaire collant (`UPage`, `UContentToc`) sur 3, date de mise à jour ; clic dans le sommaire ou sur un titre : défilement doux sans `#` dans l'adresse |
| `RedirectPage`                                                                                                                                        | Page de redirection vers un réseau ou un formulaire                                                                                                                                                                    |
