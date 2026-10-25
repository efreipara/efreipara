// Une section sur deux sur bande. startWithBand : la première l'est-elle ? (non, si ce qui précède
// est déjà sur bande, comme l'en-tête des pages intérieures)
export const isBandSection = (index: number, startWithBand = true) =>
  index >= 0 && index % 2 === (startWithBand ? 0 : 1)
