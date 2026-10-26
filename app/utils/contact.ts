// Liens d'itinéraire vers une adresse
export const mapUrls = (address: string) => ({
  google: `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: address })}`,
  apple: `https://maps.apple.com/?${new URLSearchParams({ q: address })}`,
  waze: `https://waze.com/ul?${new URLSearchParams({ q: address, navigate: 'yes' })}`,
})
