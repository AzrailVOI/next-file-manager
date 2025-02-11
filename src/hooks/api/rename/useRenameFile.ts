import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { displayError } from '@/utils/display-error'
import { pathFromItemPath } from '@/utils/path-from-itempath'

import { fileService } from '@/services/file.service'

export const useRenameFile = (
	itemPath: string,
	setIsRenaming?: Dispatch<SetStateAction<boolean>>
) => {
	const lang = useSettingsStore(state => state.lang)
	const queryClient = useQueryClient()
	const { mutate: renameFile, isPending: isRenameFilePending } = useMutation({
		mutationKey: ['rename file'],
		mutationFn: (newName: string) => fileService.renameFile(itemPath, newName),
		onSuccess() {
			console.log(
				'Invalidating query: ',
				decodeURIComponent(pathFromItemPath(itemPath))
			)
			queryClient.invalidateQueries({
				queryKey: ['tree', decodeURIComponent(pathFromItemPath(itemPath))]
			})
			queryClient.invalidateQueries({
				queryKey: ['isFile', decodeURIComponent(pathFromItemPath(itemPath))]
			})
			toast.success(
				`${TextDictionary[lang].files.file} ${TextDictionary[lang].messages.renamed.toLowerCase()}`
			)
			if (setIsRenaming) setIsRenaming(false)
		},
		onError(e) {
			displayError(e, lang)
		}
	})

	return { renameFile, isRenameFilePending }
}
