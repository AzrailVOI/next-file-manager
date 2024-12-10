import { create } from 'zustand'

import { ITextDictionary, IThemeMode } from '@/constants/dictionary'

interface IUseSettingsStore {
	theme: keyof IThemeMode
	lang: keyof ITextDictionary

	setTheme: (theme: keyof IThemeMode) => void
	setLang: (lang: keyof ITextDictionary) => void
}

const useSettingsStore = create<IUseSettingsStore>(set => ({
	theme: 'light',
	lang: 'en',

	setTheme: (theme: keyof IThemeMode) => set({ theme }),
	setLang: (lang: keyof ITextDictionary) => set({ lang })
}))

export default useSettingsStore
