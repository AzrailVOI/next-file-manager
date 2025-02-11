import { clsx } from 'clsx'
import { FolderInput } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'

import TextDictionary from '@/constants/dictionary'

import { IFileMetadata } from '@/types/file.types'

import useCreateFolderStore from '@/store/useCreateFolderStore'
import useSettingsStore from '@/store/useSettingsStore'

import { useCreateFolder } from '@/hooks/api/useCreateFolder'

interface TreeEditItemProps {
	initialTreeItem?: IFileMetadata
}

export default function TreeEditItem({ initialTreeItem }: TreeEditItemProps) {
	const { reset, register, handleSubmit } = useForm<IFileMetadata>({
		defaultValues: initialTreeItem
	})
	const pathname = usePathname()
	const { theme, lang } = useSettingsStore(state => state)
	const setIsFolderCreating = useCreateFolderStore(
		state => state.setIsFolderCreating
	)
	const { createFolder, isFolderPending } = useCreateFolder(pathname)

	function onSubmit(data: IFileMetadata) {
		createFolder(data.name)
		reset({ name: '' })
		setIsFolderCreating(false)
	}

	return (
		<form
			className={
				'flex items-center gap-2 w-full rounded-none py-1 border-b border-border text-left px-3 transition-all font-medium'
			}
			onSubmit={handleSubmit(onSubmit)}
		>
			<div>
				<FolderInput />
			</div>
			<input
				className={clsx(
					'p-1 bg-transparent rounded-md focus-within:outline focus-within:outline-1 focus-within:outline-border',
					{
						'focus-within:outline focus-within:outline-1 focus-within:outline-violet':
							theme === 'dark'
					}
				)}
				{...register('name')}
				autoFocus={true}
			/>
			<button
				disabled={isFolderPending ? true : undefined}
				className={clsx(
					'py-1 hover:text-bg hover:bg-grey transition-all px-2 rounded-md',
					{
						'hover:bg-violet': theme === 'dark'
					}
				)}
				type='submit'
			>
				{TextDictionary[lang].contextmenu.save}
			</button>
		</form>
	)
}
