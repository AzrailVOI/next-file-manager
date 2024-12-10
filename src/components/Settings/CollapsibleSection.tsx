import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { FC, ReactNode, useState } from 'react'

import { OnePxLineClient } from '@/components/OnePxLine/OnePxLineClient'
import SettingsMenuTitle from '@/components/Settings/SettingsMenuTitle'

import useSettingsStore from '@/store/useSettingsStore'

interface CollapsibleSectionProps {
	title: string
	children: ReactNode
}

export const CollapsibleSection: FC<CollapsibleSectionProps> = ({
	title,
	children
}) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const theme = useSettingsStore(state => state.theme)

	return (
		<div>
			<div
				className={clsx(
					'grid grid-cols-[auto_3rem] items-center cursor-pointer text-center transition-all hover:text-bg hover:bg-grey',
					{
						'hover:bg-violet': theme === 'dark',
						'text-bg bg-grey': isExpanded && theme === 'light',
						'text-bg bg-violet': isExpanded && theme === 'dark'
					}
				)}
				onClick={() => setIsExpanded(prev => !prev)}
			>
				<SettingsMenuTitle
					className={clsx('px-2 border-r border-border', {
						'border-violet': theme === 'dark'
					})}
					title={title}
				/>
				<motion.span
					initial={{ rotate: isExpanded ? 180 : 0 }}
					animate={{ rotate: isExpanded ? 180 : 0 }}
					transition={{ duration: 0.3 }}
					className='inline-flex px-2 justify-center'
				>
					<ChevronDown />
				</motion.span>
			</div>
			<motion.div
				initial={{ height: 0, opacity: 0 }}
				animate={{
					height: isExpanded ? 'auto' : 0,
					opacity: isExpanded ? 1 : 0
				}}
				transition={{ duration: 0.3, ease: 'easeInOut' }}
				className='overflow-hidden'
			>
				<OnePxLineClient />
				<div className={'py-1.5'}>{children}</div>
			</motion.div>
		</div>
	)
}
