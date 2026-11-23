# Efrei Para — Goals Plausible

> **Périmètre** : liste des noms d'événements envoyés à Plausible et création des Goals correspondants.
> **À mettre à jour** par `bun run goals`, jamais à la main.

Chaque clic sur un lien qui sort du site envoie un événement nommé `<page> › <lien>` ou `<zone> › <lien>` : la règle de nommage est décrite dans [PRD.md](../PRD.md#4-mesure-daudience), sa mise en œuvre dans [ARCHITECTURE.md](../ARCHITECTURE.md#mesure-daudience). Plausible ne compte un événement que si un Goal du même nom existe, et seulement à partir de sa création.

## Fichiers

- [`goals.txt`](goals.txt) : tous les noms, un par ligne, triés.
- [`goals-console.js`](goals-console.js) : les mêmes noms, envoyés un par un depuis la console du navigateur.

Les deux sont générés à partir du site : ne pas les modifier à la main.

## Créer les Goals d'un site Plausible

1. Publier la version du site dont les noms sont listés ici.
2. Ouvrir une page de ce site, puis la console du navigateur, et y coller le contenu de `goals-console.js`. Chaque ligne affichée doit se terminer par `{status: 202}`.
3. Recharger Settings → Goals dans Plausible (la liste proposée est calculée au chargement de la page), puis cliquer « + Add goal » : la fenêtre « We detected N custom events » propose de tous les ajouter. Plausible n'y cherche les événements que jusqu'à la date du jour en UTC : un envoi fait entre minuit et 1 h (2 h en été), heure de Paris, n'est proposé qu'à partir de minuit UTC.

Le script crée une conversion par Goal. Sur la production, pour ne pas fausser les chiffres, créer plutôt chaque Goal à la main depuis `goals.txt` (« + Add goal », Custom event, nom collé tel quel).

## Mettre la liste à jour

Le test `tests/e2e/goals.spec.ts` parcourt chaque page du site généré (menu des activités et menu mobile ouverts) et échoue si `goals.txt` ne correspond plus aux liens : nouveau lien, libellé renommé, page ajoutée. Les noms de la bannière viennent du contenu, car elle n'est affichée qu'avant un événement.

```bash
bun run generate
bun run goals   # réécrit goals.txt et goals-console.js
```

Un nom ajouté ou modifié demande de créer son Goal dans Plausible ; un nom disparu laisse un Goal qui ne compte plus rien, à supprimer.
