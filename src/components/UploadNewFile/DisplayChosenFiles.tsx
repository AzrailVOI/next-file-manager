import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleMinus } from 'lucide-react'

import { FileSize } from '@/components/Files/FileSize'

import TextDictionary from '@/constants/dictionary'

import useFilesStore from '@/store/useFilesStore'
import useSettingsStore from '@/store/useSettingsStore'

export default function DisplayChosenFiles() {
	const { chosenFiles, setChosenFiles } = useFilesStore(state => state)
	const { theme, lang } = useSettingsStore(state => state)

	function removeFile(file: File) {
		const newFiles = chosenFiles.filter(f => f.name !== file.name)
		setChosenFiles(newFiles)
	}

	return (
		<motion.aside
			initial={{ opacity: 0, width: '20rem', height: 0 }}
			animate={{ opacity: 1, width: '20rem', height: 'auto' }}
			exit={{ opacity: 0, width: '20rem', height: 0 }}
			transition={{ duration: 0.3 }}
			className={clsx(
				'fixed z-10 bottom-2 right-2 py-1 px-2 border border-border bg-bg rounded-lg overflow-hidden',
				{
					'border-violet bg-bg_dark': theme === 'dark'
				}
			)}
		>
			<span className={'font-bold px-2 pt-1'}>
				{TextDictionary[lang].files.size.size}:{' '}
				<FileSize
					size={chosenFiles.reduce((acc, file) => acc + file.size, 0)}
					lang={lang}
				/>
			</span>
			<div
				className={
					'flex flex-col gap-1 py-1 px-2 max-h-[10rem] overflow-y-auto'
				}
			>
				<AnimatePresence>
					{chosenFiles.map(file => (
						<motion.div
							key={file.name}
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className='w-full grid grid-cols-[2fr_1fr_auto] items-center gap-2'
						>
							<span className='overflow-x-hidden whitespace-nowrap'>
								{file.name}
							</span>
							<span>
								<FileSize
									size={file.size}
									lang={lang}
								/>
							</span>
							<span>
								<button
									className={clsx('transition-all hover:rotate-180')}
									onClick={() => removeFile(file)}
								>
									<CircleMinus />
								</button>
							</span>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</motion.aside>
	)
}
