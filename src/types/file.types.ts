export interface IFileMetadata {
	name: string
	size: number
	type: string
	lastModified: number
	uploadedAt: number
}

export interface ITreeResponse {
	files: IFileMetadata[]
	dirs: IDirMetadata[]
}

export interface IDirMetadata {
	name: string
	size: number
	lastModified: number
}

export interface IUploadResponse {
	message: string
	savedFiles: string[]
}
