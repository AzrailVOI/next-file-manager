export const pathFromItemPath = (itemPath: string) => {
	const lastIndexOfSlash = itemPath.lastIndexOf('/')
	return itemPath.substring(0, lastIndexOfSlash)
		? itemPath.substring(0, lastIndexOfSlash)
		: '/'
}
