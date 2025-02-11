import axios from 'axios'
import { toast } from 'sonner'

import TextDictionary, { ITextDictionary } from '@/constants/dictionary'

export const downloadFile = async (
	directLink: string,
	lang: keyof ITextDictionary
) => {
	try {
		// Выполняем запрос на скачивание файла
		const response = await axios.get<Blob>(directLink, {
			params: {
				download: 'true'
			},
			responseType: 'blob',
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': 'attachment'
			}
		})

		// Создаем ссылку для скачивания файла
		const blob = new Blob([response.data], { type: response.data.type })
		const url = window.URL.createObjectURL(blob)

		// Создаем временную ссылку <a> для скачивания
		const link = document.createElement('a')
		link.href = url
		link.style.display = 'none'

		// Извлекаем имя файла из заголовка Content-Disposition
		const contentDisposition = response.headers['content-disposition']
		const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/)
		console.log('fileNameMatch', fileNameMatch)
		console.log('response.headers', response.headers)
		link.download = fileNameMatch?.[1] || 'file'

		// Запускаем скачивание и удаляем временный объект
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		// Освобождаем URL
		window.URL.revokeObjectURL(url)

		toast.success(TextDictionary[lang].messages.downloaded)
	} catch (error) {
		console.error(error)
		toast.error(TextDictionary[lang].upload.error.SOMETHING_WENT_WRONG)
	}
}
