import { IValidationResult } from '@/types/folder.types'

export function validateFolderName(folderName: string): IValidationResult {
	const errors: string[] = []

	console.log('folderName', folderName)

	// Проверка на пустое значение
	if (!folderName.trim()) {
		errors.push('Имя папки не может быть пустым.')
	}

	// Проверка на длину имени (не более 255 символов)
	if (folderName.length > 255) {
		errors.push('Имя папки не должно превышать 255 символов.')
	}

	// Проверка на недопустимые символы
	const invalidCharsRegex = /[<>:"/\\|?*\x00-\x1F]/
	if (invalidCharsRegex.test(folderName)) {
		errors.push(
			'Имя папки содержит недопустимые символы: <>:"/\\|?* и управляющие символы.'
		)
	}

	// Если нет ошибок, имя папки валидно
	return {
		isValid: errors.length === 0,
		errors
	}
}
