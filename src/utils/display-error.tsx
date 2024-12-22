import { toast } from 'sonner'

import { IUploadError, UploadErrorsEnum } from '@/constants/api.constants'
import TextDictionary, { ITextDictionary } from '@/constants/dictionary'

export const displayError = (e: any, lang: keyof ITextDictionary) => {
	const error: IUploadError = {
		error: e.response.data.error,
		details: e.response.data.details || []
	}
	switch (error.error) {
		case UploadErrorsEnum.SOMETHING_WENT_WRONG ||
			UploadErrorsEnum.ALREADY_EXISTS ||
			UploadErrorsEnum.INVALID_FOLDER_NAME ||
			UploadErrorsEnum.METADATA_MISMATCH:
			toast.error(
				() => (
					<div>
						<p>{TextDictionary[lang].upload.error[error.error]}</p>
						{error.details &&
							error.details.length > 0 &&
							error.details.map(message => (
								<p key={error.error + message}>{message}</p>
							))}
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
