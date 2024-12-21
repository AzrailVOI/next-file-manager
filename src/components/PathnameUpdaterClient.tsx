'use client'

import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import useSettingsStore from '@/store/useSettingsStore'

export default function PathnameUpdaterClient() {
	const pathname = usePathname()
	const path = useMemo(() => decodeURIComponent(pathname), [pathname])
	const theme = useSettingsStore(state => state.theme)

	// Генерация путей
	const paths = path
		.split('/')
		.filter(Boolean) // Исключаем пустые элементы
		.map((_, index, array) => `/${array.slice(0, index + 1).join('/')}`)

	return (
		<motion.span
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={clsx(
				'flex items-center justify-center text-lg md:text-2xl font-bold gap-1'
			)}
		>
			<AnimatePresence mode='popLayout'>
				{paths.map((fullPath, index) => {
					const pathName = fullPath.split('/').pop() // Последний сегмент для отображения

					return (
						<motion.div
							key={fullPath}
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 10 }}
							transition={{ duration: 0.2, delay: index * 0.05 }}
							className='flex items-center gap-1'
						>
							{index >= 0 && (
								<motion.div
									key={`${fullPath}-separator`}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 10 }}
									transition={{ duration: 0.2 }}
								>
									<ChevronRight />
								</motion.div>
							)}
							<motion.div
								key={`${fullPath}-link`}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 10 }}
								transition={{ duration: 0.2 }}
							>
								<Link
									href={fullPath}
									className={clsx(
										'border border-bg transition-all rounded-lg px-2 hover:border-border',
										{
											'border-bg_dark hover:border-violet': theme === 'dark'
										}
									)}
								>
									{pathName}
								</Link>
							</motion.div>
						</motion.div>
					)
				})}
			</AnimatePresence>
		</motion.span>
	)
}
