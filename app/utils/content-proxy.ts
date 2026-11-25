// Objet qui relit `source.value` à chaque accès : `t.hero.title` sans `.value`, et réactif
// (la lecture de la ref a lieu dans le computed ou le rendu qui accède au champ).
export const contentProxy = <T extends object>(source: { readonly value: T | null | undefined }) =>
  new Proxy({} as T, {
    get: (_, key) => Reflect.get(source.value ?? {}, key),
    has: (_, key) => Reflect.has(source.value ?? {}, key),
    ownKeys: () => Reflect.ownKeys(source.value ?? {}),
    getOwnPropertyDescriptor: (_, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(source.value ?? {}, key)
      // Une propriété exposée par le proxy doit être configurable (sa cible, vide, ne l'a pas)
      return descriptor && { ...descriptor, configurable: true }
    },
  })
