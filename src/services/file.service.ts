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

	async renameFile(pathname: string, newName: string) {
		console.log('rename file: ', pathname, newName)
		const response = await axios.put<IUploadResponse>(
			`${this.BASE_URL}${pathname}?name=${encodeURIComponent(newName)}`
		)
		return response.data
	}

	async deleteFile(pathname: string) {
		console.log('delete file: ', pathname)
		const response = await axios.delete<IUploadResponse>(
			`${this.BASE_URL}${pathname}`
		)
		return response.data
	}
}

export const fileService = new FileService()
