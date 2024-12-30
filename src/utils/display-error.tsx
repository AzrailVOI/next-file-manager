import { toast } from 'sonner'

import { IUploadError, UploadErrorsEnum } from '@/constants/api.constants'
import TextDictionary, { ITextDictionary } from '@/constants/dictionary'

export const displayError = (e: any, lang: keyof ITextDictionary) => {
	const error: IUploadError = {
		error: e.response.data.error,
		details: e.response.data.details || []
	}
	switch (error.error) {
		case UploadErrorsEnum.SOMETHING_WENT_WRONG:
		case UploadErrorsEnum.ALREADY_EXISTS:
		case UploadErrorsEnum.INVALID_FOLDER_NAME:
		case UploadErrorsEnum.METADATA_MISMATCH:
			toast.error(
				() => (
					<div className={'flex flex-col gap-1.5'}>
						<b>{TextDictionary[lang].upload.error[error.error]}</b>
						{error.details && error.details.length > 0 && (
							<div className={'flex flex-col gap-1'}>
								<ul className={'ml-0.5'}>
									{error.details.map((file, index) => (
										<li key={index}>{file}</li>
									))}
								</ul>
							</div>
						)}
					</div>
				),
				{ duration: 5000 }
			)
			break
		default:
			toast.error(TextDictionary[lang].upload.error[error.error], {
				duration: 5000
			})
			break
	}
}
