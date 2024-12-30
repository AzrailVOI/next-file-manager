'use client'

import { clsx } from 'clsx'
import { File, Folder } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MouseEvent, useState } from 'react'

import { FileSize } from '@/components/Files/FileSize'

import { IDirMetadata, IFileMetadata } from '@/types/file.types'

import useSettingsStore from '@/store/useSettingsStore'

interface IFileItemProps {
	file?: IFileMetadata
	dir?: IDirMetadata
}

export default function TreeItem({ file, dir }: IFileItemProps) {
	const { theme, lang } = useSettingsStore(state => state)
	const pathname = usePathname()
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
	const { push } = useRouter()

	const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
		event.preventDefault()

		setMenuPosition({ x: event.pageX, y: event.pageY })

		// Logic to display the context menu will go here
	}

	// Определяем URL для перехода
	const itemPath = `${pathname === '/' ? '' : pathname}/${file?.name || dir?.name || ''}`

	// Определяем отображаемую иконку
	const Icon = file ? File : Folder

	// Получаем дату и время для файлов и директорий
	const lastModified = file?.lastModified || dir?.lastModified || 0
	const lastModifiedDate = new Date(lastModified).toLocaleDateString(lang)
	const lastModifiedTime = new Date(lastModified).toLocaleTimeString(lang)

	const uploadedAt = file?.uploadedAt ? new Date(file.uploadedAt) : null
	const uploadedAtDate = uploadedAt?.toLocaleDateString(lang)
	const uploadedAtTime = uploadedAt?.toLocaleTimeString(lang)

	//context menu actions
	const copyLink = () => {
		navigator.clipboard.writeText(itemPath)
	}

	const deleteItem = () => {
		console.log('delete item')
	}

	const openItem = () => {
		push(itemPath)
	}

	const renameItem = () => {
		console.log('rename item')
	}

	const saveItem = () => {
		console.log('save item')
	}

	return (
		<div
			className={'relative'}
			onContextMenu={handleContextMenu}
		>
			<Link
				href={itemPath}
				className={clsx(
					'grid grid-cols-[auto_1fr] md:grid-cols-[auto_7fr_1fr_2fr] lg:grid-cols-[auto_7fr_1fr_2fr_2fr] gap-2 cursor-pointer',
					'w-full rounded-none py-2 border-b border-border hover:bg-grey hover:text-bg hover:border-grey text-left px-3 transition-all font-medium',
					{ 'border-violet hover:bg-violet': theme === 'dark' }
				)}
			>
				{/* Иконка */}
				<span>
					<Icon />
				</span>

				{/* Имя файла или директории */}
				<span
					className={'overflow-x-hidden overflow-ellipsis whitespace-nowrap'}
				>
					{file?.name || dir?.name}
				</span>

				{/* Размер файла (если есть) */}
				{file ? (
					<span className='d-none md:inline-block'>
						{file.size ? (
							<FileSize
								size={file.size}
								lang={lang}
							/>
						) : (
							''
						)}
					</span>
				) : (
					<span className='d-none md:inline-block'>
						<FileSize
							size={dir?.size || 0}
							lang={lang}
						/>
					</span>
				)}

				{/* Дата и время последнего изменения */}
				<span className='d-none md:inline-block'>
					{lastModifiedDate} {lastModifiedTime}
				</span>

				{/* Дата и время загрузки (только для файлов) */}
				{uploadedAt ? (
					<span className='d-none lg:inline-block'>
						{uploadedAtDate} {uploadedAtTime}
					</span>
				) : (
					<span className='d-none lg:inline-block'></span>
				)}
			</Link>
			{/*<ContextMenu*/}
			{/*	x={menuPosition.x}*/}
			{/*	y={menuPosition.y}*/}
			{/*	openAction={openItem}*/}
			{/*	renameAction={renameItem}*/}
			{/*	deleteAction={deleteItem}*/}
			{/*	copyAction={copyLink}*/}
			{/*	saveAction={saveItem}*/}
			{/*/>*/}
		</div>
	)
}
