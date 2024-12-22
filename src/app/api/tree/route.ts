import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'path'

import { UploadErrorsEnum } from '@/constants/api.constants'
import { METADATA_FOLDER, UPLOAD_FOLDER } from '@/constants/files.constants'
import { validationPathnameRegex } from '@/constants/validation.constants'

import { IDirMetadata, IFileMetadata, ITreeResponse } from '@/types/file.types'

import { validateFolderName } from '@/utils/validate-folder.util'

export async function GET(req: NextRequest) {
	const pathname = decodeURIComponent(
		req.nextUrl.searchParams.get('pathname') || ''
	)

	console.log('pathname', pathname)

	if (!pathname) {
		return NextResponse.json(
			{ error: UploadErrorsEnum.PATHNAME_MISSING },
			{ status: 400 }
		)
	}
	if (!validationPathnameRegex.test(pathname)) {
		return NextResponse.json(
			{ error: UploadErrorsEnum.PATHNAME_INVALID },
			{ status: 400 }
		)
	}

	const files: IFileMetadata[] = []
	const dirs: IDirMetadata[] = []
	const metadataDir = path.join(METADATA_FOLDER, pathname)
	await fs.mkdir(metadataDir, { recursive: true })

	try {
		const items = await readdir(metadataDir, { withFileTypes: true })

		for (const item of items) {
			const itemPath = path.join(metadataDir, item.name)

			const itemStat = await stat(itemPath)

			if (item.isDirectory()) {
				dirs.push({
					name: item.name,
					lastModified: itemStat.mtimeMs
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
