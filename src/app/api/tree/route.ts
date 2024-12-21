import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'path'

import { UploadErrorsEnum } from '@/constants/api.constants'
import { METADATA_FOLDER } from '@/constants/files.constants'

import { IDirMetadata, IFileMetadata, ITreeResponse } from '@/types/file.types'

export async function GET(req: NextRequest) {
	const pathname = req.nextUrl.searchParams.get('pathname') || ''
	if (!pathname) {
		return NextResponse.json(
			{ error: UploadErrorsEnum.PATHNAME_MISSING },
			{ status: 400 }
		)
	}
	if (!/^[a-zA-Zа-яА-ЯёЁ0-9/_-]+$/.test(pathname)) {
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
