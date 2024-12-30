import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { UploadErrorsEnum } from '@/constants/api.constants'
import TextDictionary from '@/constants/dictionary'

import { ITreeResponse } from '@/types/file.types'

import useSettingsStore from '@/store/useSettingsStore'

import { treeService } from '@/services/tree.service'

export function useGetTree(pathname: string) {
	const lang = useSettingsStore(state => state.lang)
	const {
		data: tree,
		isLoading: isTreeLoading,
		isSuccess: isTreeSuccess,
		isError,
		error
	} = useQuery<ITreeResponse, any, ITreeResponse, string[]>({
		queryKey: ['tree', decodeURIComponent(pathname)],
		queryFn: () => treeService.getTree(pathname)
	})

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
