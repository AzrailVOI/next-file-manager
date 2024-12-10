import { clsx } from 'clsx'
import { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import useSettingsStore from '@/store/useSettingsStore'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string
}

export default function Button({
	children,
	className,
	...props
}: IButtonProps & PropsWithChildren) {
	const theme = useSettingsStore(state => state.theme)
	return (
		<button
			className={clsx(
				className,
				'rounded-lg border border-grey hover:bg-grey hover:text-bg transition-all text-center font-medium text-sm md:text-base',
				{
					'bg-grey text-bg': props.disabled,
					'border-violet hover:bg-violet hover:text-bg': theme === 'dark'
				}
			)}
			{...props}
		>
			{children}
		</button>
	)
}
