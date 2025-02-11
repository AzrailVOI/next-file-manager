export function getDirectPathToFile(pathname: string) {
	return `${window.location.origin}/api/file${pathname}`
}

export function getDirectPathToDirectory(pathname: string) {
	return `${window.location.origin}${pathname}`
}
