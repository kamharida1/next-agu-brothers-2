import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Agu Brothers Electronics',
    short_name: 'Agu Brothers',
    description: 'Nigeria\'s trusted electronics and home appliances store',
    start_url: '/',
    display: 'standalone',
    background_color: '#131921',
    theme_color: '#FF9900',
    orientation: 'portrait',
    categories: ['shopping', 'electronics'],
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
