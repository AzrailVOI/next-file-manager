import { clsx } from 'clsx'
import { Download, Expand, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

import Button from '@/components/Button'
import DisplayFile from '@/components/Files/DisplayFile'
import MiniLoader from '@/components/MiniLoader'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { useGetFileStream } from '@/hooks/api/useGetFileStream'

import { copyFileLinkToClipboard } from '@/utils/copy-file-link-to-clipboard'
import { downloadFile } from '@/utils/download-file'
import { getDirectPathToFile } from '@/utils/get-direct-path'

import styles from './FilePage.module.scss'

interface IFilePage {
	pathname: string
}

export default function FilePage({ pathname }: IFilePage) {
	const fileName = useMemo(() => pathname.split('/').pop(), [pathname])
	const lang = useSettingsStore(state => state.lang)
	const { file, isLoading } = useGetFileStream(pathname)
	const directPathToFile = useMemo(
		() => getDirectPathToFile(pathname),
		[pathname]
	)

	async function downloadFileHandler() {
		await downloadFile(directPathToFile, lang)
	}

	function copyToClipboardHandler() {
		copyFileLinkToClipboard(directPathToFile, lang)
	}

	return (
		<div className={'px-2 h-full grid grid-rows-[auto_1fr] '}>
			<div className={'flex justify-between flex-col lg:flex-row'}>
				<h1 className={'font-bold w-full text-xl break-all'}>
					<span className={'d-none lg:inline-block'}>
						{TextDictionary[lang].files.file}:
					</span>{' '}
					{fileName}
				</h1>
				<div className={'flex gap-2'}>
					<Button
						onClick={copyToClipboardHandler}
						className={clsx('p-2', styles.button)}
					>
						<LinkIcon />
					</Button>
					<Button
						className={clsx('p-2', styles.button)}
						onClick={downloadFileHandler}
					>
						<Download />
					</Button>
					<Link
						href={directPathToFile}
						target={'_blank'}
					>
						<Button className={clsx('p-2', styles.button)}>
							<Expand />
						</Button>
					</Link>
				</div>
			</div>
			<div className={clsx('mt-2', styles.round)}>
				{isLoading && <MiniLoader />}
				{file && <DisplayFile file={file} />}
			</div>
		</div>
	)
}
