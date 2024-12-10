'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { PropsWithChildren, useState } from 'react'
import { Toaster } from 'sonner'

import useSettingsStore from '@/store/useSettingsStore'

export default function Providers({ children }: PropsWithChildren) {
	const theme = useSettingsStore(state => state.theme)
	const [client] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false
				}
			}
		})
	)
	return (
		<QueryClientProvider client={client}>
			{children}
			{/*<ReactQueryDevtools initialIsOpen={false}/>*/}
			<Toaster
				theme={'light'}
				position={'bottom-center'}
				duration={2000}
				toastOptions={{
					classNames: {
						toast: clsx(`border`, {
							'bg-bg text-grey border-border': theme === 'light',
							'bg-bg_dark text-bg border-violet': theme === 'dark'
						})
					}
				}}
			/>
		</QueryClientProvider>
	)
}
