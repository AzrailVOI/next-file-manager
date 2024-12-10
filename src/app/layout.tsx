import { clsx } from 'clsx'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import type { ReactNode } from 'react'

import UploadNewFile from '@/components/UploadNewFile/UploadNewFile'

import TextDictionary from '@/constants/dictionary'

import { getServerLang } from '@/utils/lang/lang-server.service'
import { getServerTheme } from '@/utils/theme/theme-server.service'

import './globals.scss'
import { InitClientStore } from '@/app/InitClientStore'

export async function generateMetadata(): Promise<Metadata> {
	const lang = await getServerLang()

	return {
		title: TextDictionary[lang || 'en'].title,
		description: TextDictionary[lang || 'en'].description,
		robots: {
			follow: false,
			index: false
		}
	}
}

const montserrat = Montserrat({
	subsets: ['latin', 'cyrillic'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-montserrat',
	style: ['normal']
})

export default async function RootLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	const lang = await getServerLang()
	const theme = await getServerTheme()
	return (
		<html lang={lang || 'en'}>
			<body
				className={clsx(
					`${montserrat.className} antialiased grid grid-rows-[auto_1fr_auto]  min-h-screen px-2`,
					{
						'bg-bg_dark text-white': theme === 'dark'
					}
				)}
			>
				<InitClientStore cookies={{ lang, theme }} />

				<UploadNewFile>{children}</UploadNewFile>
			</body>
		</html>
	)
}
