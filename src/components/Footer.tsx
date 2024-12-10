import { Github, Gitlab, Globe } from 'lucide-react'

import TextDictionary from '@/constants/dictionary'

import { getServerLang } from '@/utils/lang/lang-server.service'

export default async function Footer() {
	const lang = await getServerLang()
	return (
		<footer className={'text-left text-xs flex gap-2 p-3'}>
			<i className={'opacity-80'}>{TextDictionary[lang || 'en'].developedBy}</i>

			<a
				className={'opacity-80 transition hover:opacity-100'}
				href='https://azrail.xyz'
				target='_blank'
			>
				<Globe />
			</a>
			<a
				className={'opacity-80 transition hover:opacity-100'}
				href='https://github.com/AzrailVOI'
				target='_blank'
			>
				<Github />
			</a>
			<a
				className={'opacity-80 transition hover:opacity-100'}
				href='https://gitlab.com/AzrailVOI'
				target='_blank'
			>
				<Gitlab />
			</a>
		</footer>
	)
}
