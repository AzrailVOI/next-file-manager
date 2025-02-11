import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'





type TypeOut = {
	ref: any
	isShow: boolean
	setIsShow: Dispatch<SetStateAction<boolean>>
}

export const useOutside = (init: boolean): TypeOut => {
	const [isShow, setIsShow] = useState(init)
	const ref = useRef<HTMLElement>(null)

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			setIsShow(false)
		}
	}, [])

	const handleEscape = useCallback((event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			setIsShow(false)
		}
	}, [])

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true)
		document.addEventListener('contextmenu', handleClickOutside, true)
		document.addEventListener('keydown', handleEscape, true)

		return () => {
			document.removeEventListener('click', handleClickOutside, true)
			document.removeEventListener('contextmenu', handleClickOutside, true)
			document.removeEventListener('keydown', handleEscape, true)
		}
	}, [handleClickOutside, handleEscape])

	return { ref, isShow, setIsShow }
}
