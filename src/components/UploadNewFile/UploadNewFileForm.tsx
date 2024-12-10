'use client'

import { clsx } from 'clsx'
import { AnimatePresence } from 'framer-motion'
import { FileUp, SendHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ChangeEvent, FormEvent, Fragment, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

import BigLoader from '@/components/BigLoader'
import Button from '@/components/Button'
import DisplayChosenFiles from '@/components/UploadNewFile/DisplayChosenFiles'

import TextDictionary from '@/constants/dictionary'

import useFilesStore from '@/store/useFilesStore'
import useSettingsStore from '@/store/useSettingsStore'

import { useUploadFiles } from '@/hooks/api/useUploadFiles'

import styles from './UploadNewFileForm.module.scss'

export default function UploadNewFileForm() {
	const { chosenFiles, setChosenFiles } = useFilesStore(state => state)
	const { theme, lang } = useSettingsStore(state => state)
	const pathname = usePathname()
	const { uploadFiles, isSuccess, isPending, isError } =
		useUploadFiles(pathname)

	const displayChosenFiles = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files
			if (!files) return
			setChosenFiles(Array.from(files))
		},
		[setChosenFiles]
	)

	const handleSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault()

			const data = new FormData()

			chosenFiles.forEach(file => {
				data.append('file', file) // Добавляем файл
				data.append(`${file.name}_lastModified`, file.lastModified.toString()) // Добавляем lastModified
			})

			console.log('data', data)
			// Проверка размера файлов
			if (
				chosenFiles.reduce((acc, file) => acc + file.size, 0) >
				1024 * 1024 * 1024
			) {
				toast.error(TextDictionary[lang].upload.error.FILES_TOO_LARGE, {
					duration: 5000
				})
			} else {
				console.log('FormData entries:')
				for (const pair of data.entries()) {
					console.log(pair[0], pair[1]) // Просмотр содержимого FormData
				}
				uploadFiles({ files: data })
			}
		},
		[chosenFiles, lang, uploadFiles]
	)

	useEffect(() => {
		if (isSuccess) {
			setChosenFiles([])
		}
		if (isError) {
			setChosenFiles([])
		}
	}, [setChosenFiles, lang, isSuccess, isError])

	return (
		<Fragment>
			{isPending && <BigLoader />}
			<form
				encType={'multipart/form-data'}
				onSubmit={handleSubmit}
				className={'flex flex-col gap-2'}
			>
				<div className={'flex flex-col gap-3.5'}>
					<label
						htmlFor={'file'}
						className={clsx(
							styles.choose,
							'text-sm md:text-base font-medium px-4 py-2 border border-grey hover:bg-grey hover:text-bg cursor-pointer rounded-lg transition-all flex items-center justify-center',
							{
								'border-violet hover:bg-violet': theme === 'dark',
								'bg-violet': theme === 'dark' && chosenFiles.length > 0,
								'bg-grey text-bg': theme === 'light' && chosenFiles.length > 0
							}
						)}
					>
						<FileUp />
					</label>
					<input
						type='file'
						id={'file'}
						name={'file'}
						className={'hidden w-full'}
						multiple={true}
						onChange={displayChosenFiles}
					/>

					<Button className={clsx('p-2 justify-center flex', styles.upload)}>
						<SendHorizontal />
					</Button>
				</div>
			</form>
			<AnimatePresence>
				{chosenFiles.length > 0 && <DisplayChosenFiles />}
			</AnimatePresence>
		</Fragment>
	)
}
