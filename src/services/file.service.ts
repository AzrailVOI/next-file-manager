import axios from 'axios'

import { IUploadResponse } from '@/types/file.types'

class FileService {
	private readonly BASE_URL = '/api/file'

	async getFileStream(pathname: string) {
		const response = await axios.get(`${this.BASE_URL}${pathname}`, {
			responseType: 'blob'
		})
		return response.data
	}

	async uploadFile(files: FormData, pathname: string) {
		const response = await axios.post<IUploadResponse>(
			`${this.BASE_URL}${pathname}`,
			files,
			{
				headers: { 'Content-Type': 'multipart/form-data' }
			}
		)
		return response.data
	}
}

export const fileService = new FileService()
