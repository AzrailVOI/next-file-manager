import axios from 'axios'

import { ITreeResponse } from '@/types/file.types'

class TreeService {
	private readonly BASE_URL = '/api/tree'

	async getTree(pathname: string) {
		const response = await axios.get<ITreeResponse>(this.BASE_URL, {
			params: { pathname }
		})
		return response.data
	}

	async isFile(pathname: string) {
		const response = await axios.get<boolean>(`${this.BASE_URL}/is-file`, {
			params: { pathname }
		})

		return response.data
	}

	async createFolder(name: string, pathname: string) {
		const response = await axios.post(this.BASE_URL, { name, pathname })

		return response.data
	}

	async renameFolder(name: string, pathname: string) {
		console.log('rename folder: ', name, pathname)
		const response = await axios.put(
			`${this.BASE_URL}?name=${encodeURIComponent(name)}&pathname=${encodeURIComponent(pathname)}`
		)

		return response.data
	}

	async deleteFolder(pathname: string) {
		console.log('delete folder: ', pathname)
		const response = await axios.delete(
			`${this.BASE_URL}?pathname=${encodeURIComponent(pathname)}`
		)

		return response.data
	}
}

export const treeService = new TreeService()
