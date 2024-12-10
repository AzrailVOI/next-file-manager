import { clsx } from 'clsx'
import { Folders } from 'lucide-react'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

export default function TreeHeader() {
	const { theme, lang } = useSettingsStore(state => state)
	return (
		<div
			className={clsx(
				'grid grid-cols-[auto_1fr] md:grid-cols-[auto_7fr_1fr_2fr] lg:grid-cols-[auto_7fr_1fr_2fr_2fr] gap-2 !font-bold',
				'w-full rounded-none py-2 border-b border-border text-left px-3 transition-all font-medium',
				{ 'border-violet': theme === 'dark' }
			)}
		>
			{/* Иконка */}
			<span>
				<Folders />
			</span>

			{/* Имя файла или директории */}
			<span>{TextDictionary[lang].tree.name}</span>

			<span className='d-none md:inline-block'>
				{TextDictionary[lang].tree.size}
			</span>

			{/* Дата и время последнего изменения */}
			<span className='d-none md:inline-block'>
				{TextDictionary[lang].tree.modified}
			</span>

			{/* Дата и время загрузки (только для файлов) */}

			<span className='d-none lg:inline-block'>
				{TextDictionary[lang].tree.uploadedAt}
			</span>
		</div>
	)
}
