import { clsx } from 'clsx'
import { Suspense } from 'react'

import UploadNewFileForm from '@/components/UploadNewFile/UploadNewFileForm'

interface Props {
	className?: string
}

export default function UploadSidebar({ className }: Props) {
	return (
		<aside id={clsx('upload', className)}>
			<div className={'p-1 flex flex-col gap-4 justify'}>
				<Suspense fallback={<div>Loading...</div>}>
					<UploadNewFileForm />
				</Suspense>
			</div>
		</aside>
	)
}
