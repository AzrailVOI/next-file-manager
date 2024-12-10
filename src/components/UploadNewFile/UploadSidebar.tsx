import { Suspense } from 'react'

import UploadNewFileForm from '@/components/UploadNewFile/UploadNewFileForm'

export default function UploadSidebar() {
	return (
		<aside id={'upload'}>
			<div className={'p-1 flex flex-col gap-4 justify'}>
				<Suspense fallback={<div>Loading...</div>}>
					<UploadNewFileForm />
				</Suspense>
			</div>
		</aside>
	)
}
