import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { displayError } from '@/utils/display-error'
import { pathFromItemPath } from '@/utils/path-from-itempath'

import { fileService } from '@/services/file.service'

export const useDeleteFile = (itemPath: string) => {
	const lang = useSettingsStore(state => state.lang)
	const queryClient = useQueryClient()
	const { mutate: deleteFile, isPending: isDeleteFilePending } = useMutation({
		mutationKey: ['delete file'],
		mutationFn: () => fileService.deleteFile(itemPath),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['tree', decodeURIComponent(pathFromItemPath(itemPath))]
			})
			queryClient.invalidateQueries({
				queryKey: ['isFile', decodeURIComponent(pathFromItemPath(itemPath))]
			})
			toast.success(
				`${TextDictionary[lang].files.file} ${TextDictionary[lang].messages.deleted.toLowerCase()}`
			)
		},
		onError(e) {
			displayError(e, lang)
		}
	})

	return { deleteFile, isDeleteFilePending }
}
