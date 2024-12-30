import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { displayError } from '@/utils/display-error'

import { treeService } from '@/services/tree.service'

export const useCreateFolder = (pathname: string) => {
	const lang = useSettingsStore(state => state.lang)
	const queryClient = useQueryClient()
	const { mutate: createFolder, isPending: isFolderPending } = useMutation({
		mutationKey: ['createFolder'],
		mutationFn: (name: string) => treeService.createFolder(name, pathname),
		onError(error: any) {
			displayError(error, lang)
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['tree', decodeURIComponent(pathname)]
			})
			toast.success(TextDictionary[lang].tree.successCreated)
		}
	})

	return { createFolder, isFolderPending }
}
