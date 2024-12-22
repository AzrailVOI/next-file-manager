import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

import TextDictionary from '@/constants/dictionary'

import useSettingsStore from '@/store/useSettingsStore'

import { displayError } from '@/utils/display-error'

export const useCreateFolder = (pathname: string) => {
	const lang = useSettingsStore(state => state.lang)
	const queryClient = useQueryClient()
	const { mutate: createFolder, isPending: isFolderPending } = useMutation({
		mutationKey: ['createFolder'],
		mutationFn: (name: string) => axios.post('/api/tree', { name, pathname }),
		onError(error: any) {
			displayError(error, lang)
		},
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['tree', pathname] })
			toast.success(TextDictionary[lang].tree.successCreated)
		}
	})

	return { createFolder, isFolderPending }
}
