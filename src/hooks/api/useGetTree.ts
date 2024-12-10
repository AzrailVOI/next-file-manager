import { useQuery } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { UploadErrorsEnum } from '@/constants/api.constants'
import TextDictionary from '@/constants/dictionary'

import { ITreeResponse } from '@/types/file.types'

import useSettingsStore from '@/store/useSettingsStore'

export function useGetTree(pathname: string) {
	const lang = useSettingsStore(state => state.lang)
	const {
		data: tree,
		isLoading: isTreeLoading,
		isSuccess: isTreeSuccess,
		isError,
		error
	} = useQuery<AxiosResponse<ITreeResponse, any>, any, ITreeResponse, string[]>(
		{
			queryKey: ['tree', pathname],
			queryFn: () =>
				axios.get<ITreeResponse>('/api/tree', { params: { pathname } }),
			select: data => data.data
		}
	)

	useEffect(() => {
		if (isError) {
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
	}, [isError, error, lang])

	return { tree, isTreeLoading, isTreeSuccess }
}
