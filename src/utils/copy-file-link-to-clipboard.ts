import { toast } from 'sonner'

import TextDictionary, { ITextDictionary } from '@/constants/dictionary'

export function copyFileLinkToClipboard(
	directPathToFile: string,
	lang: keyof ITextDictionary
) {
	navigator.clipboard
		.writeText(directPathToFile)
		.then(() => toast.success(TextDictionary[lang].messages.copiedLink))
		.catch(() =>
			toast.success(TextDictionary[lang].upload.error.SOMETHING_WENT_WRONG)
		)
}
