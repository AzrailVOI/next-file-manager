import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { displayError } from '@/utils/display-error'
import { pathFromItemPath } from '@/utils/path-from-itempath'

import { treeService } from '@/services/tree.service'

export const useRenameFolder = (
	itemPath: string,
	setIsRenaming?: Dispatch<SetStateAction<boolean>>
) => {
	const lang = useSettingsStore(state => state.lang)
	const queryClient = useQueryClient()
	const { mutate: renameFolder, isPending: isRenameFolderPending } =
		useMutation({
			mutationKey: ['rename folder'],
			mutationFn: (newName: string) =>
				treeService.renameFolder(newName, itemPath),
			onError(error: any) {
				displayError(error, lang)
			},
			onSuccess() {
				console.log(
					'Invalidating query: ',
					decodeURIComponent(pathFromItemPath(pathFromItemPath(itemPath)))
				)
				queryClient.invalidateQueries({
					queryKey: ['tree', decodeURIComponent(pathFromItemPath(itemPath))]
				})
				queryClient.invalidateQueries({
					queryKey: ['isFile', decodeURIComponent(pathFromItemPath(itemPath))]
				})

				toast.success(
					`${TextDictionary[lang].tree.folder} ${TextDictionary[lang].messages.renamed.toLowerCase()}`
				)
				if (setIsRenaming) setIsRenaming(false)
			}
		})

	return { renameFolder, isRenameFolderPending }
}
