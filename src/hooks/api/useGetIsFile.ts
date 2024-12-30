import { useQuery } from '@tanstack/react-query'

import { treeService } from '@/services/tree.service'

export const useGetIsFile = (pathname: string) => {
	const {
		data: isFile,
		isLoading: isFileLoading,
		isSuccess: isFileSuccess
	} = useQuery({
		queryKey: ['isFile', decodeURIComponent(pathname)],
		queryFn: () => treeService.isFile(pathname)
	})

	return { isFile, isFileLoading, isFileSuccess }
}
