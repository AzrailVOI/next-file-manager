import { create } from 'zustand'

interface IUseFilesStore {
	chosenFiles: File[]
	setChosenFiles: (files: File[]) => void
}

const useFilesStore = create<IUseFilesStore>(set => ({
	chosenFiles: [],
	setChosenFiles: (files: File[]) => set({ chosenFiles: files })
}))

export default useFilesStore
