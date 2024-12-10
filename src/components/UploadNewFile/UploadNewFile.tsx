import { clsx } from 'clsx'
import Link from 'next/link'
import { Fragment, PropsWithChildren } from 'react'

import Footer from '@/components/Footer'
import { OnePxLineServer } from '@/components/OnePxLine/OnePxLineServer'
import PathnameUpdaterClient from '@/components/PathnameUpdaterClient'
import Settings from '@/components/Settings/Settings'
import UploadSidebar from '@/components/UploadNewFile/UploadSidebar'

import TextDictionary from '@/constants/dictionary'

import { getServerLang } from '@/utils/lang/lang-server.service'
import { getServerTheme } from '@/utils/theme/theme-server.service'

import Providers from '@/app/providers'

export default async function UploadNewFile({
	children
}: PropsWithChildren<unknown>) {
	const lang = await getServerLang()
	const theme = await getServerTheme()

	return (
		<Fragment>
			<header className={'p-1'}>
				<Link
					href={'/'}
					className={'block text-2xl md:text-4xl font-bold text-center mb-3'}
				>
					{TextDictionary[lang || 'en'].title}
				</Link>
				<OnePxLineServer />
			</header>
			<Settings />
			<div
				className={
					'grid gap-2 lg:gap-5 2xl:grid-cols-[1.1fr_6fr] grid-cols-[1.2fr_6fr] lg:grid-rows-[auto_1fr] mt-1'
				}
			>
				<h2
					className={
						'd-none lg:block text-xl md:text-2xl font-bold text-center'
					}
				>
					{TextDictionary[lang || 'en'].upload.upload}
				</h2>
				<div className={'d-none lg:flex gap-2'}>
					<Link
						href={'/'}
						className={clsx(
							'text-lg md:text-2xl font-bold transition-all bg-bg rounded-lg px-2 hover:bg-grey hover:text-bg will-change-[background-color]',
							{
								'bg-bg_dark hover:bg-violet': theme === 'dark'
							}
						)}
					>
						{TextDictionary[lang || 'en'].files.title}
					</Link>
					<PathnameUpdaterClient />
				</div>

				<Providers>
					<UploadSidebar />
					<main className={'py-1'}>
						{/*<p>{TextDictionary[lang || 'en'].files.newFolder}</p>*/}

						{children}
					</main>
				</Providers>
			</div>
			<Footer />
		</Fragment>
	)
}
