import { clsx } from 'clsx'
import { Download, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import DisplayFile from '@/components/Files/DisplayFile'
import MiniLoader from '@/components/MiniLoader'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { useGetFileStream } from '@/hooks/api/useGetFileStream'

import styles from './FilePage.module.scss'

interface IFilePage {
	pathname: string
}

export default function FilePage({ pathname }: IFilePage) {
	const fileName = useMemo(() => pathname.split('/').pop(), [pathname])
	const origin = useMemo(() => window.location.origin, [])
	const lang = useSettingsStore(state => state.lang)
	const { file, isLoading } = useGetFileStream(pathname)

	function copyToClipboard() {
		navigator.clipboard
			.writeText(`${origin}/api/file${pathname}`)
			.then(() => console.log('Copied to clipboard'))
			.catch(e => console.error(e))

		toast.success(TextDictionary[lang].messages.copiedLink)
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
						onClick={copyToClipboard}
						className={clsx('p-2', styles.button)}
					>
						<LinkIcon />
					</Button>
					<Link
						href={`/api/file${pathname}`}
						target={'_blank'}
					>
						<Button className={clsx('block p-2', styles.button)}>
							<Download />
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
