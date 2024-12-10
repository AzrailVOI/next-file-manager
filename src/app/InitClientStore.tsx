'use client'

import { ICookies } from '@/types/cookies.types'

import useSettingsStore from '@/store/useSettingsStore'

interface IInitClientStore {
	cookies: ICookies
}

export function InitClientStore({ cookies }: IInitClientStore) {
	const { theme, setTheme, setLang, lang } = useSettingsStore(state => state)

	if (theme !== cookies.theme) setTheme(cookies.theme)
	if (lang !== cookies.lang) setLang(cookies.lang)

	return null
}
