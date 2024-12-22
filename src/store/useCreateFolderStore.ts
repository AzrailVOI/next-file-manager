import { create } from 'zustand'

interface IUseFolderStore {
	isFolderCreating: boolean
	setIsFolderCreating: (isCreating: boolean) => void
}

const useCreateFolderStore = create<IUseFolderStore>(set => ({
	isFolderCreating: false,
	setIsFolderCreating: (isFolderCreating: boolean) => set({ isFolderCreating })
}))

export default useCreateFolderStore
