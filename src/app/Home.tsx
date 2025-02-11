'use client'

import { usePathname } from 'next/navigation'
import { Fragment, useMemo } from 'react'

import FilePage from '@/components/Files/FilePage'
import TreePage from '@/components/Files/TreePage'
import MiniLoader from '@/components/MiniLoader'

import { useGetIsFile } from '@/hooks/api/useGetIsFile'

export default function Home() {
	const pathname = usePathname()
	const path = useMemo(() => decodeURIComponent(pathname), [pathname])
	const { isFile, isFileLoading, isFileSuccess } = useGetIsFile(pathname)

	return (
		<Fragment>
			{isFileLoading && <MiniLoader />}
			{isFileSuccess && (
				<>
					{isFile ? (
						<FilePage pathname={path} />
					) : (
						<TreePage pathname={pathname} />
					)}
				</>
			)}
		</Fragment>
	)
}
