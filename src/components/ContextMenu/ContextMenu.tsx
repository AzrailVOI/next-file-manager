import { clsx } from 'clsx'
import { Dispatch, SetStateAction, forwardRef, useMemo } from 'react'

import TextDictionary, { IContextMenu } from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

interface IContextMenuProps {
	x: number
	y: number
	openAction: () => void
	renameAction: () => void
	deleteAction: () => void
	copyAction: () => void
	saveAction?: () => void
	setIsShow: Dispatch<SetStateAction<boolean>>
}

const ContextMenu = forwardRef<HTMLElement, IContextMenuProps>(
	(
		{
			x,
			y,
			copyAction,
			openAction,
			saveAction,
			renameAction,
			deleteAction,
			setIsShow
		},
		ref
	) => {
		const { theme, lang } = useSettingsStore(state => state)
		const activeActions = useMemo<(keyof IContextMenu)[]>(() => {
			const actions: (keyof IContextMenu)[] = []
			actions.push('open')
			actions.push('rename')
			actions.push('delete')
			actions.push('copy')
			if (saveAction) actions.push('save')
			return actions
		}, [saveAction])
		return (
			<aside
				ref={ref}
				className={clsx(
					'fixed rounded-lg bg-bg border border-border w-min text-nowrap flex flex-col gap-0.5 z-10',
					{
						'border-violet bg-bg_dark': theme === 'dark'
					}
				)}
				style={{ top: `${y}px`, left: `${x}px` }}
			>
				{activeActions.map((action, index) => (
					<button
						key={index}
						className={clsx(
							'w-full text-left px-2 py-1 text-sm hover:bg-grey hover:text-bg transition-all',
							{
								'hover:bg-violet text-bg': theme === 'dark'
							}
						)}
						onClick={() => {
							switch (action) {
								case 'open':
									openAction()
									break
								case 'rename':
									renameAction()
									break
								case 'delete':
									deleteAction()
									break
								case 'copy':
									copyAction()
									break
								case 'save':
									if (saveAction) saveAction()
									break
							}
							setIsShow(false)
						}}
					>
						{TextDictionary[lang].contextmenu[action as keyof IContextMenu]}
					</button>
				))}
			</aside>
		)
	}
)

ContextMenu.displayName = 'ContextMenu'

export default ContextMenu
