import type {MetadataRoute} from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SentiLyon',
        short_name: 'SentiLyon',
        description: 'Protéger et aider les Lyonnais face aux inondations et autres catastrophes naturelles.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FCFCFCFF',
        theme_color: '#333333FF',
        icons: [
            {
                src: '/logo/Coat_of_Arms_of_Lyon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: "any"
            },
            {
                src: '/logo/Coat_of_Arms_of_Lyon.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
            },
            {
                src: '/logo/Coat_of_Arms_of_Lyon.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
            },
        ],
    }
}