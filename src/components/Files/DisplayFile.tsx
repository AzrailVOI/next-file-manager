'use client'

import { clsx } from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import styles from './FilePage.module.scss'

export default function DisplayFile({ file }: { file: Blob }) {
	const [fileURL, setFileURL] = useState<string | null>(null)
	const [mimeType, setMimeType] = useState<string | null>(null)
	const { lang, theme } = useSettingsStore(state => state)

	useEffect(() => {
		if (file) {
			const url = URL.createObjectURL(file)
			setFileURL(url)

			// Устанавливаем MIME-тип из Blob
			setMimeType(file.type || 'application/octet-stream')
		}

		// Освобождаем URL при размонтировании компонента
		return () => {
			if (fileURL) {
				URL.revokeObjectURL(fileURL)
			}
		}
		// Зависим только от `file`, так как `fileURL` создается только из `file`
	}, [file])

	if (!fileURL || !mimeType)
		return (
			<h3 className={'text-xl italic'}>
				{TextDictionary[lang].upload.error.NO_FILES}
			</h3>
		)

	if (mimeType.startsWith('text')) {
		return (
			<iframe
				src={fileURL}
				title='Text File Viewer'
				style={{
					width: '100%',
					height: '100%',
					border: '1px solid #ccc'
				}}
				className={clsx('will-change-[filter]', {
					[styles.textDisplayDark]: theme === 'dark'
				})}
			/>
		)
	}

	if (mimeType.startsWith('image')) {
		return (
			<Image
				src={fileURL}
				alt='File'
				width={600}
				height={600}
				className={'max-h-full max-w-full'}
			/>
		)
	}

	if (mimeType.startsWith('audio')) {
		return (
			<audio
				controls
				src={fileURL}
			/>
		)
	}

	if (mimeType.startsWith('video')) {
		return (
			<video
				controls
				style={{ maxWidth: '100%' }}
				src={fileURL}
			/>
		)
	}

	if (mimeType === 'application/pdf') {
		return (
			<iframe
				src={fileURL}
				title='PDF Viewer'
				style={{
					width: '100%',
					height: '100%',
					border: 'none'
				}}
			/>
		)
	}

	return (
		<h3 className={'text-xl italic'}>
			{TextDictionary[lang].upload.error.UNSUPPORTED_FILE_TYPE}
		</h3>
	)
}
