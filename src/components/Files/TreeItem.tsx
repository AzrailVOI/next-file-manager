'use client'

import { clsx } from 'clsx'
import { File, Folder } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment, MouseEvent, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ContextMenu from '@/components/ContextMenu/ContextMenu'
import { FileSize } from '@/components/Files/FileSize'

import { validationPathnameRegex } from '@/constants/validation.constants'

import { IDirMetadata, IFileMetadata } from '@/types/file.types'

import useSettingsStore from '@/store/useSettingsStore'

import { useDeleteFile } from '@/hooks/api/delete/useDeleteFile'
import { useDeleteFolder } from '@/hooks/api/delete/useDeleteFolder'
import { useRenameFile } from '@/hooks/api/rename/useRenameFile'
import { useRenameFolder } from '@/hooks/api/rename/useRenameFolder'
import { useOutside } from '@/hooks/useOutside'

import { copyFileLinkToClipboard } from '@/utils/copy-file-link-to-clipboard'
import { downloadFile } from '@/utils/download-file'
import {
	getDirectPathToDirectory,
	getDirectPathToFile
} from '@/utils/get-direct-path'

interface IFileItemProps {
	file?: IFileMetadata
	dir?: IDirMetadata
}

interface IRenamingProps {
	name: string
}

export default function TreeItem({ file, dir }: IFileItemProps) {
	const { theme, lang } = useSettingsStore(state => state)
	const pathname = usePathname()
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
	const { push } = useRouter()
	const { isShow, setIsShow, ref } = useOutside(false)

	const isDirectory = useMemo(() => dir !== undefined, [dir])

	const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
		event.preventDefault()

		// Получаем размеры окна
		const windowWidth = window.innerWidth
		const windowHeight = window.innerHeight

		// Координаты курсора
		let posX = event.clientX
		let posY = event.clientY
		// Если меню уже отрендерилось, узнаем его реальные размеры
		setTimeout(() => {
			if (ref.current) {
				const { width, height } = ref.current.getBoundingClientRect()

				// Корректируем позицию, чтобы меню не выходило за границы окна
				if (posX + width > windowWidth) {
					posX = windowWidth - width - 20
				}
				if (posY + height > windowHeight) {
					posY = windowHeight - height - 20
				}

				setMenuPosition({ x: posX, y: posY })
			}
		}, 0)

		setMenuPosition({ x: posX, y: posY })
		setIsShow(true)
	}

	// Определяем URL для перехода
	const itemPath = `${pathname === '/' ? '' : pathname}/${isDirectory ? dir?.name : file?.name}`

	const directPathToFile = useMemo(() => {
		if (isDirectory) {
			return getDirectPathToDirectory(itemPath)
		} else {
			return getDirectPathToFile(itemPath)
		}
	}, [itemPath, isDirectory])

	// Определяем отображаемую иконку
	const Icon = isDirectory ? Folder : File

	// Получаем дату и время для файлов и директорий
	const lastModified = file?.lastModified || dir?.lastModified || 0
	const lastModifiedDate = new Date(lastModified).toLocaleDateString(lang)
	const lastModifiedTime = new Date(lastModified).toLocaleTimeString(lang)

	const uploadedAt = file?.uploadedAt ? new Date(file.uploadedAt) : null
	const uploadedAtDate = uploadedAt?.toLocaleDateString(lang)
	const uploadedAtTime = uploadedAt?.toLocaleTimeString(lang)

	//context menu actions
	const copyLink = async () => {
		copyFileLinkToClipboard(directPathToFile, lang)
	}

	const openItem = () => {
		push(itemPath)
	}

	/*RENAME*/

	const [isRenaming, setIsRenaming] = useState<boolean>(false)
	const { renameFile, isRenameFilePending } = useRenameFile(
		itemPath,
		setIsRenaming
	)
	const { renameFolder, isRenameFolderPending } = useRenameFolder(
		itemPath,
		setIsRenaming
	)
	const renameItem = () => {
		console.log('rename item: ', file?.name || dir?.name)
		setIsRenaming(true)
	}
	const {
		handleSubmit: handleSubmitRename,
		register: registerRename,
		formState: { errors: errorsRename }
	} = useForm<IRenamingProps>({
		defaultValues: { name: file?.name || dir?.name },
		mode: 'onSubmit'
	})

	const onSubmitRename = (data: IRenamingProps) => {
		console.log('renamed item: ', data.name)
		if (isRenameFilePending || isRenameFolderPending) return
		if (isDirectory) {
			renameFolder(data.name)
		} else {
			renameFile(data.name)
		}
		// setTimeout(() => setIsRenaming(false), 100)
	}
	useEffect(() => {
		if (errorsRename.name?.message)
			toast.error(errorsRename.name?.message || '')
	}, [errorsRename])

	/*RENAME*/

	/*DELETE*/
	const { deleteFolder, isDeleteFolderPending } = useDeleteFolder(itemPath)
	const { deleteFile, isDeleteFilePending } = useDeleteFile(itemPath)

	const deleteItem = () => {
		if (isDeleteFolderPending || isDeleteFilePending) return
		if (isDirectory) {
			deleteFolder()
		} else {
			deleteFile()
		}
	}
	/*DELETE*/

	const saveItem = async () => {
		await downloadFile(directPathToFile, lang)
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
				onClick={e => {
					if (isRenaming) {
						e.preventDefault() // Отмена перехода во время переименования
					}
				}}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						if (isRenaming) {
							e.preventDefault()
						}
					}
				}}
				onDragStart={e => {
					if (isRenaming) {
						e.preventDefault()
					}
				}}
			>
				{/* Иконка */}
				<span>
					<Icon />
				</span>

				{/* Имя файла или директории */}
				{isRenaming ? (
					<form onSubmit={handleSubmitRename(onSubmitRename)}>
						<input
							type='text'
							className={
								'overflow-x-hidden overflow-ellipsis whitespace-nowrap bg-transparent'
							}
							autoFocus={true}
							onKeyDown={e => e.stopPropagation()}
							onClick={e => e.stopPropagation()}
							{...registerRename('name', {
								required: true,
								maxLength: 255,
								minLength: 1,
								pattern: validationPathnameRegex
							})}
						/>
						<button
							type='submit'
							className={'d-none'}
							disabled={
								isRenameFilePending || isRenameFolderPending ? true : undefined
							}
							onClick={e => e.stopPropagation()}
						>
							Submit
						</button>
					</form>
				) : (
					<span
						className={'overflow-x-hidden overflow-ellipsis whitespace-nowrap'}
					>
						{file?.name || dir?.name}
					</span>
				)}

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
			{isShow && (
				<Fragment>
					{isDirectory ? (
						<ContextMenu
							ref={ref}
							x={menuPosition.x}
							y={menuPosition.y}
							openAction={openItem}
							renameAction={renameItem}
							deleteAction={deleteItem}
							copyAction={copyLink}
							setIsShow={setIsShow}
						/>
					) : (
						<ContextMenu
							ref={ref}
							x={menuPosition.x}
							y={menuPosition.y}
							openAction={openItem}
							renameAction={renameItem}
							deleteAction={deleteItem}
							copyAction={copyLink}
							saveAction={saveItem}
							setIsShow={setIsShow}
						/>
					)}
				</Fragment>
			)}
		</div>
	)
}
