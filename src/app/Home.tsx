'use client'

import { usePathname } from 'next/navigation'
import { Fragment, useMemo } from 'react'

import FilePage from '@/components/Files/FilePage'
import TreePage from '@/components/Files/TreePage'

export default function Home() {
	const pathname = usePathname()
	const path = useMemo(() => decodeURIComponent(pathname), [pathname])
	const isFile = useMemo(() => path.includes('.'), [path])

	return (
		<Fragment>
			{isFile ? <FilePage pathname={path} /> : <TreePage pathname={path} />}
		</Fragment>
	)
}
