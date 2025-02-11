import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'path'

import { UploadErrorsEnum } from '@/constants/api.constants'
import { METADATA_FOLDER, UPLOAD_FOLDER } from '@/constants/files.constants'

import { IDirMetadata, IFileMetadata, ITreeResponse } from '@/types/file.types'

import { validateFolderName } from '@/utils/validate-folder.util'

import { validatePathname } from '@/app/api/utils/validate-pathname.util'

export async function GET(req: NextRequest) {
	const pathname = decodeURIComponent(
		req.nextUrl.searchParams.get('pathname') || ''
	)

	validatePathname(pathname)

	const files: IFileMetadata[] = []
	const dirs: IDirMetadata[] = []
	const metadataDir = path.join(METADATA_FOLDER, pathname)

	const isMetadataDirExist = await fs
		.access(metadataDir)
		.then(() => true)
		.catch(() => false)

	if (!isMetadataDirExist) {
		return NextResponse.json(
			{ error: UploadErrorsEnum.PATHNAME_INVALID },
			{ status: 400 }
		)
	}

	await fs.mkdir(METADATA_FOLDER, { recursive: true })

	try {
		const items = await readdir(metadataDir, { withFileTypes: true })

		for (const item of items) {
			const itemPath = path.join(metadataDir, item.name)

			console.log('itemPath', itemPath)
			const itemStat = await stat(itemPath)

			if (item.isDirectory()) {
				const dirSize = await getFolderSize(itemPath)
				console.log('dirSize', dirSize)
				dirs.push({
					name: item.name,
					lastModified: itemStat.mtimeMs,
					size: dirSize
				}) // Добавляем директорию в массив `dirs`
			} else if (item.isFile()) {
				const fileContent = await readFile(itemPath, 'utf-8')
				try {
					files.push(JSON.parse(fileContent)) // Парсим метаданные файла
				} catch (err: any) {
					console.error(
						`Error parsing metadata for file ${item.name}:`,
						err.message
					)
				}
			}
		}

		const response: ITreeResponse = {
			files,
			dirs
		}

		return NextResponse.json(response, { status: 200 })
	} catch (err: any) {
		console.error('Error reading directory:', err)
		return NextResponse.json(
			{
				error: UploadErrorsEnum.SOMETHING_WENT_WRONG
			},
			{ status: 400 }
		)
	}
}

export async function POST(req: NextRequest) {
	try {
		const folderInfo = await req.json()

		const name = decodeURIComponent(folderInfo.name)
		if (!name) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.PATHNAME_MISSING },
				{ status: 400 }
			)
		}
		const pathname = decodeURIComponent(folderInfo.pathname)

		// Валидация имени папки
		const validation = validateFolderName(name)
		if (!validation.isValid) {
			return NextResponse.json(
				{
					error: UploadErrorsEnum.INVALID_NAME,
					details: validation.errors
				},
				{ status: 400 }
			)
		}

		// Генерация путей для папок
		const metadataDir = path.join(METADATA_FOLDER, pathname, name)
		const saveDir = path.join(UPLOAD_FOLDER, pathname, name)

		// Создание папок
		await fs.mkdir(metadataDir, { recursive: true })
		await fs.mkdir(saveDir, { recursive: true })

		return NextResponse.json({ error: null }, { status: 200 })
	} catch (err: any) {
		console.error(err)
		return NextResponse.json(
			{
				error: UploadErrorsEnum.SOMETHING_WENT_WRONG,
				details: [err.message]
			},
			{ status: 500 }
		)
	}
}

//RENAMING
export async function PUT(req: NextRequest) {
	try {
		// Получение пути папки
		const pathname = decodeURIComponent(
			req.nextUrl.searchParams.get('pathname') || ''
		)
		validatePathname(pathname)

		// Новое имя папки
		const newName = decodeURIComponent(
			req.nextUrl.searchParams.get('name') || ''
		)
		if (!newName) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.PATHNAME_MISSING },
				{ status: 400 }
			)
		}

		// Проверка валидности имени
		const validation = validateFolderName(newName)
		if (!validation.isValid) {
			return NextResponse.json(
				{
					error: UploadErrorsEnum.INVALID_NAME,
					details: validation.errors
				},
				{ status: 400 }
			)
		}

		// Пути старой и новой папки
		const oldFolderPath = path.join(UPLOAD_FOLDER, pathname)
		const newFolderPath = path.join(
			UPLOAD_FOLDER,
			path.dirname(pathname),
			newName
		)

		// Пути метаданных
		const metadataOldFolderPath = path.join(METADATA_FOLDER, pathname)
		const metadataNewFolderPath = path.join(
			METADATA_FOLDER,
			path.dirname(pathname),
			newName
		)

		// Проверка существования старой папки
		const folderExists = await fs
			.access(oldFolderPath)
			.then(() => true)
			.catch(() => false)
		const metadataExists = await fs
			.access(metadataOldFolderPath)
			.then(() => true)
			.catch(() => false)

		if (!folderExists || !metadataExists) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.NO_ONES },
				{ status: 404 }
			)
		}

		// Проверка на существование папки с новым именем
		const newFolderExists = await fs
			.access(newFolderPath)
			.then(() => true)
			.catch(() => false)
		const newMetadataFolderExists = await fs
			.access(metadataNewFolderPath)
			.then(() => true)
			.catch(() => false)

		if (newFolderExists || newMetadataFolderExists) {
			return NextResponse.json(
				{
					error: UploadErrorsEnum.ALREADY_EXISTS,
					details: [newName]
				},
				{ status: 400 }
			)
		}

		// Переименование папки и её метаданных
		await fs.rename(oldFolderPath, newFolderPath)
		await fs.rename(metadataOldFolderPath, metadataNewFolderPath)

		return NextResponse.json(
			{ message: 'Folder and metadata renamed successfully' },
			{ status: 200 }
		)
	} catch (err: any) {
		console.error('Error during folder renaming:', err)
		return NextResponse.json(
			{
				error: UploadErrorsEnum.SOMETHING_WENT_WRONG,
				details: [err.message]
			},
			{ status: 500 }
		)
	}
}

export async function DELETE(req: NextRequest) {
	try {
		// Получение пути папки
		const pathname = decodeURIComponent(
			req.nextUrl.searchParams.get('pathname') || ''
		)
		validatePathname(pathname)

		// Пути папки
		const folderPath = path.join(UPLOAD_FOLDER, pathname)
		const metadataFolderPath = path.join(METADATA_FOLDER, pathname)

		// Проверка существования папки
		const folderExists = await fs
			.access(folderPath)
			.then(() => true)
			.catch(() => false)
		const metadataExists = await fs
			.access(metadataFolderPath)
			.then(() => true)
			.catch(() => false)

		if (!folderExists || !metadataExists) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.NO_ONES },
				{ status: 404 }
			)
		}

		// Удаление папки и её метаданных
		await fs.rm(folderPath, { recursive: true, force: true })
		await fs.rm(metadataFolderPath, { recursive: true, force: true })

		return NextResponse.json(
			{ message: 'Folder and metadata deleted successfully' },
			{ status: 200 }
		)
	} catch (err: any) {
		console.error('Error during folder deletion:', err)
		return NextResponse.json(
			{
				error: UploadErrorsEnum.SOMETHING_WENT_WRONG,
				details: [err.message]
			},
			{ status: 500 }
		)
	}
}

async function getFolderSize(folderPath: string) {
	let totalSize = 0

	async function calculateSize(dirPath: string) {
		const entries = await fs.readdir(dirPath, { withFileTypes: true })
		for (const entry of entries) {
			const entryPath = path.join(dirPath, entry.name)
			if (entry.isDirectory()) {
				await calculateSize(entryPath) // Рекурсивно обрабатываем вложенные папки
			} else if (entry.isFile()) {
				const file = await readFile(entryPath, 'utf-8')
				totalSize += JSON.parse(file).size
			}
		}
	}

	await calculateSize(folderPath)
	return totalSize
}
