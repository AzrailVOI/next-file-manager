import { RefreshCcw } from 'lucide-react'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { setClientTheme } from '@/utils/theme/theme-client.service'

export const ThemeChanger = () => {
	const { theme, lang } = useSettingsStore(state => state)

	return (
		<div className={'flex justify-between px-3'}>
			<span>
				{theme === 'dark'
					? TextDictionary[lang || 'en'].settings.theme.mode.dark
					: TextDictionary[lang || 'en'].settings.theme.mode.light}
			</span>
			<button
				onClick={() => {
					setClientTheme(theme === 'dark' ? 'light' : 'dark')
						.then(() => document.location.reload())
						.catch(e => console.error(e))
				}}
				className={
					'hover:-rotate-180 transition-all duration-300 cursor-pointer'
				}
			>
				<RefreshCcw />
			</button>
		</div>
	)
}
