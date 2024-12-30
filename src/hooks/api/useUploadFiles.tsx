import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import TextDictionary from '@/constants/dictionary'

import { IUploadResponse } from '@/types/file.types'

import useSettingsStore from '@/store/useSettingsStore'

import { displayError } from '@/utils/display-error'

import { fileService } from '@/services/file.service'

export const useUploadFiles = (pathname: string) => {
	const lang = useSettingsStore(state => state.lang)

	const queryClient = useQueryClient()
	const {
		mutate: uploadFiles,
		isSuccess,
		isError,
		isPending
	} = useMutation<
		IUploadResponse,
		any,
		{ files: FormData } // Тип аргумента функции mutationFn
	>({
		mutationFn: ({ files }) => fileService.uploadFile(files, pathname),
		onSuccess: data => {
			console.log('Invalidating query: ', pathname)
			queryClient.invalidateQueries({
				queryKey: ['tree', decodeURIComponent(pathname)]
			})
			toast.success(
				<div className={'flex flex-col gap-1.5'}>
					<b>{TextDictionary[lang].upload.success}</b>
					<div className={'flex flex-col gap-1'}>
						<b>{TextDictionary[lang].upload.savedFiles}:</b>
						<ul className={'ml-0.5'}>
							{data.savedFiles.map((file, index) => (
								<li key={index}>{file}</li>
							))}
						</ul>
					</div>
				</div>
			)
		},
		onError: error => {
			displayError(error, lang)
		}
	})

	return { uploadFiles, isError, isPending, isSuccess }
}
