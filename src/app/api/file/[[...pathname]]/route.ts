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

import { validatePathname } from '@/app/api/utils/validate-pathname.util'

export const config = {
	api: {
		bodyParser: false // Отключаем встроенный парсер
	}
}

async function handleFileSaving(
	file: File,
	saveDir: string,
	metadataDir: string,
	formData: FormData
) {
	const buffer = Buffer.from(await file.arrayBuffer())
	const filePath = path.join(saveDir, file.name)
	const metadataPath = path.join(metadataDir, `${file.name}.metadata.json`)

	const fileLastModified = formData.get(`${file.name}_lastModified`) as string
	const lastModified = fileLastModified ? Number(fileLastModified) : Date.now()
	const metadata: IFileMetadata = {
		name: file.name,
		size: file.size,
		type: file.type,
		lastModified,
		uploadedAt: Date.now()
	}

	await writeFile(filePath, buffer)
	await utimes(filePath, new Date(), new Date(lastModified))
	await writeFile(metadataPath, JSON.stringify(metadata, null, 2))
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ pathname: string[] }> }
) {
	try {
		const pathname = ((await params).pathname || []).join('/')
		validatePathname(pathname)

		const formData = await req.formData()
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

		await Promise.all([
			fs.mkdir(saveDir, { recursive: true }),
			fs.mkdir(metadataDir, { recursive: true })
		])

		const existedFiles = []
		for (const file of files) {
			if (
				await fs
					.access(path.join(saveDir, file.name))
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
			await handleFileSaving(file, saveDir, metadataDir, formData)
		}

		return NextResponse.json(
			{
				message: 'Files uploaded successfully',
				savedFiles: files.map(f => f.name)
			},
			{ status: 201 }
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
		const pathname = ((await params).pathname || []).join('/')
		validatePathname(pathname)
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
