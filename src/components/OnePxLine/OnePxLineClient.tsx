'use client'

import { clsx } from 'clsx'

import useSettingsStore from '@/store/useSettingsStore'

export function OnePxLineClient() {
	const theme = useSettingsStore(state => state.theme)
	return (
		<div
			className={clsx('w-full h-[1px] bg-border', {
				'bg-violet': theme === 'dark'
			})}
		></div>
	)
}
