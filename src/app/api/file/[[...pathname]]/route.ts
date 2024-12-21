import { promises as fs } from 'fs'
import mime from 'mime'
import { NextRequest, NextResponse } from 'next/server'
import { createReadStream } from 'node:fs'
import { utimes, writeFile } from 'node:fs/promises'
import path from 'path'

import { UploadErrorsEnum } from '@/constants/api.constants'
import {
	MAX_FILES_SIZE,
	METADATA_FOLDER,
	UPLOAD_FOLDER
} from '@/constants/files.constants'

import { IFileMetadata } from '@/types/file.types'

export const config = {
	api: {
		bodyParser: false // Отключаем встроенный парсер
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ pathname: string[] }> }
) {
	try {
		const pathnameParam = (await params).pathname
		const pathname = pathnameParam.join('/')
		console.log('pathname', pathname)
		if (!pathname) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.PATHNAME_MISSING },
				{ status: 400 }
			)
		}
		//PATHNAME INVALID CHECK
		if (!/^[a-zA-Zа-яА-ЯёЁ0-9/_-]+$/.test(pathname)) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.PATHNAME_INVALID },
				{ status: 400 }
			)
		}

		const formData = await req.formData()
		console.log('formData', formData)
		const files: File[] = formData.getAll('file') as File[]
		if (!files || files.length === 0) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.NO_FILES },
				{ status: 400 }
			)
		}

		if (files.reduce((acc, file) => acc + file.size, 0) > MAX_FILES_SIZE) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.FILES_TOO_LARGE },
				{ status: 400 }
			)
		}

		const saveDir = path.join(UPLOAD_FOLDER, pathname)
		const metadataDir = path.join(METADATA_FOLDER, pathname)
		await fs.mkdir(saveDir, { recursive: true })
		await fs.mkdir(metadataDir, { recursive: true })
		console.log('saveDir', saveDir)
		console.log('metadataDir', metadataDir)

		const existedFiles = []
		for (const file of files) {
			const filePath = path.join(saveDir, file.name)
			if (
				await fs
					.access(filePath)
					.then(() => true)
					.catch(() => false)
			) {
				existedFiles.push(file.name)
			}
		}

		if (existedFiles.length > 0) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.ALREADY_EXISTS, details: existedFiles },
				{ status: 400 }
			)
		}

		for (const file of files) {
			try {
				const fileLastModified = formData.get(
					`${file.name}_lastModified`
				) as string
				const lastModified = fileLastModified
					? Number(fileLastModified)
					: Date.now()
				const metadata: IFileMetadata = {
					name: file.name,
					size: file.size,
					type: file.type,
					lastModified,
					uploadedAt: Date.now()
				}

				const buffer = Buffer.from(await file.arrayBuffer())
				const filename = file.name
				const filePath = path.join(saveDir, filename)

				// Сохраняем файл
				await writeFile(filePath, buffer)

				// Устанавливаем lastModified для файла
				const now = new Date()
				await utimes(filePath, now, new Date(lastModified)) // `atime` (последний доступ) и `mtime` (последняя модификация)

				// Сохраняем метаданные
				const metadataPath = path.join(metadataDir, `${filename}.metadata.json`)
				await writeFile(metadataPath, JSON.stringify(metadata, null, 2))
			} catch (err: any) {
				return NextResponse.json(
					{
						error: UploadErrorsEnum.SOMETHING_WENT_WRONG,
						details: [err.message]
					},
					{ status: 500 }
				)
			}
		}

		return NextResponse.json(
			{
				message: 'Files uploaded successfully',
				savedFiles: files.map(file => file.name)
			},
			{ status: 200 }
		)
	} catch (err: any) {
		console.error(err)
		return NextResponse.json(
			{ error: UploadErrorsEnum.SOMETHING_WENT_WRONG, details: [err.message] },
			{ status: 500 }
		)
	}
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ pathname: Array<string> }> }
) {
	try {
		const pathnameArray = (await params).pathname || '' //[ 'lol', 'c59acac2006f65ca7ef6689b1a9795d2.pdf' ]
		const pathname = pathnameArray.join('/')
		console.log('pathname', pathname)
		if (!pathname) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.PATHNAME_MISSING },
				{ status: 400 }
			)
		}

		const filePath = path.join(UPLOAD_FOLDER, pathname)
		try {
			await fs.access(filePath) // Проверяем, существует ли файл
		} catch {
			return NextResponse.json(
				{ error: UploadErrorsEnum.NO_FILES },
				{ status: 404 }
			)
		}

		const mimeType = mime.getType(filePath) || 'application/octet-stream'
		const fileStream = createReadStream(filePath)
		const readableStream = new ReadableStream({
			start(controller) {
				fileStream.on('data', chunk => controller.enqueue(chunk))
				fileStream.on('end', () => controller.close())
				fileStream.on('error', err => controller.error(err))
			}
		})

		return new NextResponse(readableStream, {
			headers: {
				'Content-Type': mimeType,
				'Cache-Control': 'no-cache'
			}
		})
	} catch (err: any) {
		console.error(err)
		return NextResponse.json(
			{ error: UploadErrorsEnum.SOMETHING_WENT_WRONG, details: [err.message] },
			{ status: 500 }
		)
	}
}
