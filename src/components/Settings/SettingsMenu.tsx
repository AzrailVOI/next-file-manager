import { clsx } from 'clsx'
import { motion } from 'framer-motion'

import { OnePxLineClient } from '@/components/OnePxLine/OnePxLineClient'
import { CollapsibleSection } from '@/components/Settings/CollapsibleSection'
import LanguageChanger from '@/components/Settings/LanguageChanger'
import { ThemeChanger } from '@/components/Settings/ThemeChanger'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

interface ISettingsMenu {
	isOpen: boolean
}

export default function SettingsMenu({ isOpen }: ISettingsMenu) {
	const { theme, lang } = useSettingsStore(state => state)
	return (
		<motion.div
			initial={{ height: 0, opacity: 0 }}
			animate={{
				height: isOpen ? 'auto' : 0,
				opacity: isOpen ? 1 : 0
			}}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
			className={clsx(
				'absolute top-0 right-0 border border-border rounded-lg bg-bg overflow-hidden',
				{
					'border-violet bg-bg_dark': theme === 'dark'
				}
			)}
		>
			<CollapsibleSection
				title={TextDictionary[lang || 'en'].settings.language}
			>
				<LanguageChanger initialLang={lang} />
			</CollapsibleSection>

			<OnePxLineClient />

			<CollapsibleSection
				title={TextDictionary[lang || 'en'].settings.theme.theme}
			>
				<ThemeChanger />
			</CollapsibleSection>
		</motion.div>
	)
}
