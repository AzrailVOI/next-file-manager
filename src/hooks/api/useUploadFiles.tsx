import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

import { IUploadError, UploadErrorsEnum } from '@/constants/api.constants'
import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

export const useUploadFiles = (pathname: string) => {
	const lang = useSettingsStore(state => state.lang)

	const queryClient = useQueryClient()
	const {
		mutate: uploadFiles,
		isSuccess,
		isError,
		isPending
	} = useMutation<
		string,
		any,
		{ files: FormData } // Тип аргумента функции mutationFn
	>({
		mutationFn: ({ files }) =>
			axios
				.post<string>(`/api/file${pathname}`, files, {
					headers: { 'Content-Type': 'multipart/form-data' }
				})
				.then(res => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tree', pathname] })
			toast.success(TextDictionary[lang].upload.success)
		},
		onError: e => {
			const error: IUploadError = {
				error: e.response.data.error,
				details: e.response.data.details || []
			}
			switch (error.error) {
				case UploadErrorsEnum.SOMETHING_WENT_WRONG ||
					UploadErrorsEnum.ALREADY_EXISTS ||
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
	})

	return { uploadFiles, isError, isPending, isSuccess }
}
