'use client'

import { Fragment, Suspense } from 'react'

import TreeEditItem from '@/components/Files/TreeEditItem'
import TreeHeader from '@/components/Files/TreeHeader'
import TreeItem from '@/components/Files/TreeItem'
import MiniLoader from '@/components/MiniLoader'
import { OnePxLineClient } from '@/components/OnePxLine/OnePxLineClient'

import TextDictionary from '@/constants/dictionary'

import useCreateFolderStore from '@/store/useCreateFolderStore'
import useSettingsStore from '@/store/useSettingsStore'

import { useGetTree } from '@/hooks/api/useGetTree'

interface IFilePageProps {
	pathname: string
}

export default function TreePage({ pathname }: IFilePageProps) {
	const { tree, isTreeLoading } = useGetTree(pathname)
	const lang = useSettingsStore(state => state.lang)
	const { isFolderCreating, setIsFolderCreating } = useCreateFolderStore(
		state => state
	)

	return (
		<Fragment>
			<OnePxLineClient />
			<TreeHeader />
			{isTreeLoading && <MiniLoader className={'w-full'} />}
			<Suspense fallback={<MiniLoader className={'w-full'} />}>
				{tree && (tree.files.length > 0 || tree.dirs.length > 0) ? (
					<>
						{tree.dirs.length > 0 &&
							tree.dirs.map(dir => (
								<TreeItem
									key={dir.name}
									dir={dir}
								/>
							))}
						{tree.files.length > 0 &&
							tree.files.map(file => (
								<TreeItem
									key={file.name}
									file={file}
								/>
							))}
					</>
				) : (
					<span className={'px-2 text-xl italic'}>
						{TextDictionary[lang].files.noFiles}
					</span>
				)}
			</Suspense>
			{isFolderCreating && <TreeEditItem />}
		</Fragment>
	)
}
