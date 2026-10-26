import { describe, expect, it } from 'vitest'
import { mapUrls } from '../../app/utils/contact'

describe('mapUrls', () => {
  it('encode l’adresse dans les liens Google Maps, Apple Plans et Waze', () => {
    const urls = mapUrls('Efrei, 30-32 Avenue de la République, 94800 Villejuif')
    const query = 'Efrei%2C+30-32+Avenue+de+la+R%C3%A9publique%2C+94800+Villejuif'
    expect(urls).toEqual({
      google: `https://www.google.com/maps/search/?api=1&query=${query}`,
      apple: `https://maps.apple.com/?q=${query}`,
      waze: `https://waze.com/ul?q=${query}&navigate=yes`,
    })
  })
})
