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

import { validateFolderName } from '@/utils/validate-folder.util'

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
				{ error: UploadErrorsEnum.NO_ONES },
				{ status: 400 }
			)
		}

		if (files.reduce((acc, file) => acc + file.size, 0) > MAX_FILES_SIZE) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.TOO_LARGE },
				{ status: 400 }
			)
		}

		const saveDir = path.join(UPLOAD_FOLDER, pathname)
		const metadataDir = path.join(METADATA_FOLDER, pathname)

		const isSaveDirExist = await fs
			.access(saveDir)
			.then(() => true)
			.catch(() => false)

		if (!isSaveDirExist) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.PATHNAME_INVALID },
				{ status: 404 }
			)
		}

		const isMetadataDirExist = await fs
			.access(metadataDir)
			.then(() => true)
			.catch(() => false)

		if (!isMetadataDirExist) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.PATHNAME_INVALID },
				{ status: 404 }
			)
		}

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

		const filePath = path.join(UPLOAD_FOLDER, pathname)
		try {
			await fs.access(filePath) // Проверяем, существует ли файл
		} catch {
			return NextResponse.json(
				{ error: UploadErrorsEnum.NO_ONES },
				{ status: 404 }
			)
		}

		const fileName = path.basename(filePath)

		const mimeType = mime.getType(filePath) || 'application/octet-stream'
		const fileStream = createReadStream(filePath)
		const readableStream = new ReadableStream({
			start(controller) {
				fileStream.on('data', chunk => controller.enqueue(chunk))
				fileStream.on('end', () => controller.close())
				fileStream.on('error', err => controller.error(err))
			}
		})

		const isDownload = req.nextUrl.searchParams.get('download') === 'true'
		if (isDownload) {
			return new NextResponse(readableStream, {
				headers: {
					'Content-Type': mimeType,
					'Cache-Control': 'no-cache',
					'Content-Disposition': `attachment; filename="${fileName}"`
				}
			})
		}
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

//RENAMING
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ pathname: Array<string> }> }
) {
	try {
		// Извлечение параметров пути
		const pathname = ((await params).pathname || []).join('/')
		validatePathname(pathname)

		// Новый имя файла
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

		// Пути старого и нового файла
		const oldFilePath = path.join(UPLOAD_FOLDER, pathname)
		const newFilePath = path.join(
			UPLOAD_FOLDER,
			path.dirname(pathname),
			newName
		)

		// Пути метаданных
		const metadataFilePath = path.join(
			METADATA_FOLDER,
			`${pathname}.metadata.json`
		)
		const newMetadataFilePath = path.join(
			METADATA_FOLDER,
			path.dirname(pathname),
			`${newName}.metadata.json`
		)

		// Проверка существования файла и метаданных
		const fileExists = await fs
			.access(oldFilePath)
			.then(() => true)
			.catch(() => false)
		const metadataExists = await fs
			.access(metadataFilePath)
			.then(() => true)
			.catch(() => false)

		if (!fileExists || !metadataExists) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.NO_ONES },
				{ status: 404 }
			)
		}

		// Проверка на существование файла с новым именем
		const newFileExists = await fs
			.access(newFilePath)
			.then(() => true)
			.catch(() => false)

		if (newFileExists) {
			return NextResponse.json(
				{
					error: UploadErrorsEnum.ALREADY_EXISTS,
					details: [newName]
				},
				{ status: 400 }
			)
		}

		// Переименование файла
		await fs.rename(oldFilePath, newFilePath)

		// Обновление метаданных
		const metadataContent = await fs.readFile(metadataFilePath, 'utf-8')
		const metadata: IFileMetadata = JSON.parse(metadataContent)

		metadata.name = newName // Обновляем имя файла в метаданных
		metadata.lastModified = Date.now() // Обновляем дату последней модификации

		await fs.writeFile(newMetadataFilePath, JSON.stringify(metadata, null, 2))

		// Удаление старого файла метаданных
		await fs.unlink(metadataFilePath)

		return NextResponse.json(
			{ message: 'File and metadata updated successfully' },
			{ status: 200 }
		)
	} catch (err: any) {
		console.error('Error during file renaming:', err)
		return NextResponse.json(
			{
				error: UploadErrorsEnum.SOMETHING_WENT_WRONG,
				details: [err.message]
			},
			{ status: 500 }
		)
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ pathname: Array<string> }> }
) {
	try {
		const pathname = ((await params).pathname || []).join('/')
		validatePathname(pathname)

		const filePath = path.join(UPLOAD_FOLDER, pathname)
		const metadataFilePath = path.join(
			METADATA_FOLDER,
			`${pathname}.metadata.json`
		)

		const fileExists = await fs
			.access(filePath)
			.then(() => true)
			.catch(() => false)
		const metadataExists = await fs
			.access(metadataFilePath)
			.then(() => true)
			.catch(() => false)

		if (!fileExists || !metadataExists) {
			return NextResponse.json(
				{ error: UploadErrorsEnum.NO_ONES },
				{ status: 404 }
			)
		}

		await fs.unlink(filePath)
		await fs.unlink(metadataFilePath)

		return NextResponse.json(
			{ message: 'File and metadata deleted successfully' },
			{ status: 200 }
		)
	} catch (err: any) {
		console.error('Error during file deletion:', err)
		return NextResponse.json(
			{
				error: UploadErrorsEnum.SOMETHING_WENT_WRONG,
				details: [err.message]
			},
			{ status: 500 }
		)
	}
}
