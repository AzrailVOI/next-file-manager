import { NextRequest, NextResponse } from 'next/server'
import { stat } from 'node:fs/promises'
import path from 'path'

import { UPLOAD_FOLDER } from '@/constants/files.constants'

import { validatePathname } from '@/app/api/utils/validate-pathname.util'

export async function GET(req: NextRequest) {
	const pathname = decodeURIComponent(
		req.nextUrl.searchParams.get('pathname') || ''
	)

	validatePathname(pathname)

	console.log('is file pathname: ', pathname)

	const itemPath = path.join(UPLOAD_FOLDER, pathname)

	try {
		const itemStat = await stat(itemPath)

		if (!itemStat.isFile()) {
			return NextResponse.json(false)
		}

		return NextResponse.json(true)
	} catch (e) {
		console.error('Error in is File', e)
		return NextResponse.json(false)
	}
}
