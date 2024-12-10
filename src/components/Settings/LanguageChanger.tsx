'use client'

import { clsx } from 'clsx'

import TextDictionary, { ITextDictionary } from '@/constants/dictionary'

import { setLang } from '@/utils/lang/lang-client.service'

interface ILanguageChanger {
	initialLang: string
}

export default function LanguageChanger({ initialLang }: ILanguageChanger) {
	const handleLangChange = async (langCode: keyof ITextDictionary) => {
		if (langCode === initialLang) return
		try {
			await setLang(langCode)
			window.location.reload()
		} catch (error) {
			console.error('Ошибка при изменении языка:', error)
		}
	}
	return (
		<aside className={'flex flex-col justify-end px-3'}>
			{Object.keys(TextDictionary).map(langCode => (
				<button
					key={langCode}
					className={clsx('text-sm hover:underline text-left p-0 m-0', {
						'font-bold': langCode === initialLang
					})}
					onClick={() => handleLangChange(langCode as keyof ITextDictionary)}
				>
					{TextDictionary[langCode as keyof ITextDictionary].lang}
				</button>
			))}
		</aside>
	)
}
