import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { displayError } from '@/utils/display-error'
import { pathFromItemPath } from '@/utils/path-from-itempath'

import { treeService } from '@/services/tree.service'

export const useDeleteFolder = (itemPath: string) => {
	const queryClient = useQueryClient()
	const lang = useSettingsStore(state => state.lang)

	const { mutate: deleteFolder, isPending: isDeleteFolderPending } =
		useMutation({
			mutationKey: ['delete folder'],
			mutationFn: () => treeService.deleteFolder(itemPath),
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: ['tree', decodeURIComponent(pathFromItemPath(itemPath))]
				})
				queryClient.invalidateQueries({
					queryKey: ['isFile', decodeURIComponent(pathFromItemPath(itemPath))]
				})

				toast.success(
					`${TextDictionary[lang].tree.folder} ${TextDictionary[lang].messages.deleted.toLowerCase()}`
				)
			},
			onError(error: any) {
				displayError(error, lang)
			}
		})

	return { deleteFolder, isDeleteFolderPending }
}
