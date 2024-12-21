import type { MetadataRoute } from 'next'

import TextDictionary, { ITextDictionary } from '@/constants/dictionary'

import { getServerLang } from '@/utils/lang/lang-server.service'

export default function manifest(): MetadataRoute.Manifest {
	let lang: keyof ITextDictionary = 'en'
	getServerLang().then(res => (lang = res))
	return {
		name: TextDictionary[lang].title,
		short_name: TextDictionary[lang].title,
		description: TextDictionary[lang].description,
		start_url: '/',
		display: 'standalone',
		background_color: '#dedede',
		theme_color: '#24242f',
		icons: [
			{
				src: '/icon192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/icon512x512.png',
				sizes: '512x512',
				type: 'image/png'
			}
		],
		lang: lang,
		orientation: 'portrait'
	}
}
