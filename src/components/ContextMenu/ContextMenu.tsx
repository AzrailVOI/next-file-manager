import { clsx } from 'clsx'

import TextDictionary, { IContextMenu } from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

interface IContextMenuProps {
	x: number
	y: number
	openAction: () => void
	renameAction: () => void
	deleteAction: () => void
	copyAction: () => void
	saveAction: () => void
}

export default function ContextMenu({
	x,
	y,
	copyAction,
	openAction,
	saveAction,
	renameAction,
	deleteAction
}: IContextMenuProps) {
	const { theme, lang } = useSettingsStore(state => state)
	return (
		<aside
			className={clsx(
				'absolute rounded-lg bg-bg border border-border w-min text-nowrap flex flex-col gap-0.5 z-10',
				{
					'border-violet bg-bg_dark': theme === 'dark'
				}
			)}
			style={{ top: y, left: x }}
		>
			{Object.keys(TextDictionary[lang].contextmenu).map((action, index) => (
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
								saveAction()
								break
						}
					}}
				>
					{TextDictionary[lang].contextmenu[action as keyof IContextMenu]}
				</button>
			))}
		</aside>
	)
}
