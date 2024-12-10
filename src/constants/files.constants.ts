import path from 'path'

export const MAX_FILES_SIZE = 100 * 1024 * 1024

export const UPLOAD_FOLDER = path.join(process.cwd(), 'tree/upload')
export const METADATA_FOLDER = path.join(process.cwd(), 'tree/metadata')
