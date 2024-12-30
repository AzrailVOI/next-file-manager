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
			{ status: 500 }
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
					error: UploadErrorsEnum.INVALID_FOLDER_NAME,
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
