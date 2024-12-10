import { useQuery } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { UploadErrorsEnum } from '@/constants/api.constants'
import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

export const useGetFileStream = (pathname: string) => {
	const lang = useSettingsStore(state => state.lang)
	const {
		data: file,
		isLoading,
		error
	} = useQuery<AxiosResponse<Blob, any>, any, Blob, string[]>({
		queryKey: ['file', pathname],
		queryFn: () =>
			axios.get(`/api/file${pathname}`, {
				responseType: 'blob'
			}),
		select: data => data.data
	})

	useEffect(() => {
		if (error) {
			try {
				const e: UploadErrorsEnum = error.response.data
					.error as UploadErrorsEnum
				toast.error(
					TextDictionary[lang].upload.error[e]
						? TextDictionary[lang].upload.error[e]
						: TextDictionary[lang].upload.error.SOMETHING_WENT_WRONG
				)
			} catch (err) {
				console.error(err)
			}
		}
	}, [error, lang])

	return { file, isLoading, error }
}
