import { NextResponse } from 'next/server'

import { UploadErrorsEnum } from '@/constants/api.constants'
import { validationPathnameRegex } from '@/constants/validation.constants'

export function validatePathname(pathname: string) {
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
}
