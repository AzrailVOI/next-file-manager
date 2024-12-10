'use server'

import { clsx } from 'clsx'

import { getServerTheme } from '@/utils/theme/theme-server.service'

export async function OnePxLineServer() {
	const theme = await getServerTheme()
	return (
		<div
			className={clsx('w-full h-[1px] bg-border', {
				'bg-violet': theme === 'dark'
			})}
		></div>
	)
}
