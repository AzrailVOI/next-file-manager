import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { displayError } from '@/utils/display-error'

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
		onError: error => {
			displayError(error, lang)
		}
	})

	return { uploadFiles, isError, isPending, isSuccess }
}
