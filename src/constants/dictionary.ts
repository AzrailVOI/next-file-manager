import { UploadErrorsEnum } from '@/constants/api.constants'





const TextDictionary: ITextDictionary = {
	en: {
		lang: 'English',
		title: 'File manager',
		description: 'File manager by Azraїl [https://azrail.xyz/]',
		developedBy: 'Developed by Azraїl',
		tree: {
			name: 'Name',
			size: 'Size',
			folder: 'Folder',
			modified: 'Last modified',
			uploadedAt: 'Uploaded at',
			successCreated: 'Folder created successfully',
			errors: {
				[UploadErrorsEnum.SOMETHING_WENT_WRONG]: 'Something went wrong',
				[UploadErrorsEnum.PATHNAME_MISSING]: 'Pathname is missing',
				[UploadErrorsEnum.PATHNAME_INVALID]: 'Pathname is invalid',
				[UploadErrorsEnum.NO_ONES]: 'No folders selected',
				[UploadErrorsEnum.TOO_LARGE]: 'Folder too large',
				[UploadErrorsEnum.ALREADY_EXISTS]: 'Folder already exists',
				[UploadErrorsEnum.METADATA_MISMATCH]: 'Metadata mismatch',
				[UploadErrorsEnum.INVALID_METADATA]: 'Invalid metadata',
				[UploadErrorsEnum.UNSUPPORTED_FILE_TYPE]:
					'Impossible to display folder',
				[UploadErrorsEnum.INVALID_NAME]: 'Invalid folder name'
			}
		},
		messages: {
			copied: 'Copied',
			renamed: 'Renamed',
			deleted: 'Deleted',
			copiedLink: 'Link copied',
			downloaded: 'Downloaded'
		},
		upload: {
			title: 'Upload new files',
			choose: 'Choose files',
			upload: 'Upload',
			savedFiles: 'Saved files',
			success: 'Files uploaded successfully',
			error: {
				[UploadErrorsEnum.SOMETHING_WENT_WRONG]: 'Something went wrong',
				[UploadErrorsEnum.PATHNAME_MISSING]: 'Pathname is missing',
				[UploadErrorsEnum.PATHNAME_INVALID]: 'Pathname is invalid',
				[UploadErrorsEnum.NO_ONES]: 'No files selected',
				[UploadErrorsEnum.TOO_LARGE]: 'Files too large',
				[UploadErrorsEnum.ALREADY_EXISTS]: 'Files already exists',
				[UploadErrorsEnum.METADATA_MISMATCH]: 'Metadata mismatch',
				[UploadErrorsEnum.INVALID_METADATA]: 'Invalid metadata',
				[UploadErrorsEnum.UNSUPPORTED_FILE_TYPE]: 'Impossible to display file',
				[UploadErrorsEnum.INVALID_NAME]: 'Invalid folder name'
			},
			maxSize: 'Max files size is 100 MB'
		},
		files: {
			title: 'Your files',
			newFolder: 'Create new folder',
			file: 'File',
			noFiles: 'No files here',
			size: {
				size: 'Size',
				b: 'B',
				kb: 'KB',
				mb: 'MB',
				gb: 'GB'
			}
		},
		contextmenu: {
			open: 'Open',
			rename: 'Rename',
			delete: 'Delete',
			copy: 'Copy link',
			save: 'Save'
		},
		settings: {
			language: 'Language',
			theme: {
				theme: 'Theme',
				mode: {
					dark: 'Dark',
					light: 'Light'
				}
			}
		}
	},
	uk: {
		lang: 'Українська',
		title: 'Файловий провідник',
		description: 'Файловий провідник від Азраїла [https://azrail.xyz/]',
		developedBy: 'Розроблено Азраїлом',
		tree: {
			name: 'Назва',
			size: 'Розмір',
			folder: 'Папка',
			modified: 'Остання зміна',
			uploadedAt: 'Завантажено',
			successCreated: 'Папка успішно створена',
			errors: {
				[UploadErrorsEnum.SOMETHING_WENT_WRONG]: 'Щось пішло не так',
				[UploadErrorsEnum.PATHNAME_MISSING]: 'Шлях відсутній',
				[UploadErrorsEnum.PATHNAME_INVALID]: 'Шлях неправильний',
				[UploadErrorsEnum.NO_ONES]: 'Папки не вибрані',
				[UploadErrorsEnum.TOO_LARGE]: 'Папка занадто велика',
				[UploadErrorsEnum.ALREADY_EXISTS]: 'Папка вже існує',
				[UploadErrorsEnum.METADATA_MISMATCH]: 'Неспівпадіння метаданих',
				[UploadErrorsEnum.INVALID_METADATA]: 'Неправильні метадані',
				[UploadErrorsEnum.UNSUPPORTED_FILE_TYPE]: 'Неможливо відобразити папку',
				[UploadErrorsEnum.INVALID_NAME]: 'Неправильна назва папки'
			}
		},
		messages: {
			copied: 'Скопійовано',
			renamed: 'Переименовано',
			deleted: 'Видалено',
			copiedLink: 'Посилання скопійовано',
			downloaded: 'Завантажено'
		},
		upload: {
			title: 'Завантажити нові файли',
			choose: 'Вибрати файли',
			upload: 'Завантажити',
			savedFiles: 'Збережені файли',
			success: 'Файли успішно завантажено',
			error: {
				[UploadErrorsEnum.SOMETHING_WENT_WRONG]: 'Щось пішло не так',
				[UploadErrorsEnum.PATHNAME_MISSING]: 'Шлях відсутній',
				[UploadErrorsEnum.PATHNAME_INVALID]: 'Шлях неправильний',
				[UploadErrorsEnum.NO_ONES]: 'Файли не вибрані',
				[UploadErrorsEnum.TOO_LARGE]: 'Файли занадто великі',
				[UploadErrorsEnum.ALREADY_EXISTS]: 'Файли вже існують',
				[UploadErrorsEnum.METADATA_MISMATCH]: 'Неспівпадіння метаданих',
				[UploadErrorsEnum.INVALID_METADATA]: 'Неправильні метадані',
				[UploadErrorsEnum.UNSUPPORTED_FILE_TYPE]: 'Неможливо відобразити файл',
				[UploadErrorsEnum.INVALID_NAME]: 'Неправильна назва папки'
			},
			maxSize: 'Максимальний розмір файлів 100 МБ'
		},
		files: {
			title: 'Ваші файли',
			newFolder: 'Створити нову папку',
			file: 'Файл',
			noFiles: 'Тут немає файлів',
			size: {
				size: 'Розмір',
				b: 'Б',
				kb: 'КБ',
				mb: 'МБ',
				gb: 'ГБ'
			}
		},
		contextmenu: {
			open: 'Відкрити',
			rename: 'Перейменувати',
			delete: 'Видалити',
			copy: 'Копіювати посилання',
			save: 'Зберегти'
		},
		settings: {
			language: 'Мова',
			theme: {
				theme: 'Тема',
				mode: {
					dark: 'Темна',
					light: 'Світла'
				}
			}
		}
	},
	ru: {
		lang: 'Русский',
		title: 'Проводник файлов',
		description: 'Проводник файлов Азраїла [https://azrail.xyz/]',
		developedBy: 'Разработано Азраїлом',
		tree: {
			name: 'Название',
			size: 'Размер',
			folder: 'Папка',
			modified: 'Последнее изменение',
			uploadedAt: 'Загружено',
			successCreated: 'Папка успешно создана',
			errors: {
				[UploadErrorsEnum.SOMETHING_WENT_WRONG]: 'Что-то пошло не так',
				[UploadErrorsEnum.PATHNAME_MISSING]: 'Отсутствует путь',
				[UploadErrorsEnum.PATHNAME_INVALID]: 'Неправильный путь',
				[UploadErrorsEnum.NO_ONES]: 'Папки не выбраны',
				[UploadErrorsEnum.TOO_LARGE]: 'Папка слишком большая',
				[UploadErrorsEnum.ALREADY_EXISTS]: 'Папка уже существует',
				[UploadErrorsEnum.METADATA_MISMATCH]: 'Несовпадение метаданных',
				[UploadErrorsEnum.INVALID_METADATA]: 'Неправильные метаданные',
				[UploadErrorsEnum.UNSUPPORTED_FILE_TYPE]: 'Невозможно отобразить папку',
				[UploadErrorsEnum.INVALID_NAME]: 'Неправильное имя папки'
			}
		},
		messages: {
			copied: 'Скопирован',
			renamed: 'Переименован',
			deleted: 'Удален',
			copiedLink: 'Ссылка скопирована',
			downloaded: 'Скачан'
		},
		upload: {
			title: 'Загрузить новые файлы',
			choose: 'Выбрать файлы',
			upload: 'Загрузить',
			savedFiles: 'Сохраненные файлы',
			success: 'Файлы успешно загружены',
			error: {
				[UploadErrorsEnum.SOMETHING_WENT_WRONG]: 'Что-то пошло не так',
				[UploadErrorsEnum.PATHNAME_MISSING]: 'Отсутствует путь',
				[UploadErrorsEnum.PATHNAME_INVALID]: 'Неправильный путь',
				[UploadErrorsEnum.NO_ONES]: 'Файлы не выбраны',
				[UploadErrorsEnum.TOO_LARGE]: 'Файлы слишком большие',
				[UploadErrorsEnum.ALREADY_EXISTS]: 'Файлы уже существуют',
				[UploadErrorsEnum.METADATA_MISMATCH]: 'Несовпадение метаданных',
				[UploadErrorsEnum.INVALID_METADATA]: 'Неправильные метаданные',
				[UploadErrorsEnum.UNSUPPORTED_FILE_TYPE]: 'Невозможно отобразить файл',
				[UploadErrorsEnum.INVALID_NAME]: 'Неправильное имя папки'
			},
			maxSize: 'Максимальный размер файлов 100 МБ'
		},
		files: {
			title: 'Ваши файлы',
			newFolder: 'Создать новую папку',
			file: 'Файл',
			noFiles: 'Здесь нет файлов',
			size: {
				size: 'Размер',
				b: 'Б',
				kb: 'КБ',
				mb: 'МБ',
				gb: 'ГБ'
			}
		},
		contextmenu: {
			open: 'Открыть',
			rename: 'Переименовать',
			delete: 'Удалить',
			copy: 'Скопировать ссылку',
			save: 'Сохранить'
		},
		settings: {
			language: 'Язык',
			theme: {
				theme: 'Тема',
				mode: {
					dark: 'Темная',
					light: 'Светлая'
				}
			}
		}
	},
	sk: {
		lang: 'Slovenčina',
		title: 'Správca súborov',
		description: 'Správca súborov od Azraїla [https://azrail.xyz/]',
		developedBy: 'Vytvoril Azraїl',
		tree: {
			name: 'Meno',
			size: 'Velkost',
			folder: 'Zložka',
			modified: 'Posledný zmena',
			uploadedAt: 'Nahraté',
			successCreated: 'Zložka bola uspešne vytvorena',
			errors: {
				[UploadErrorsEnum.SOMETHING_WENT_WRONG]: 'Nastala chyba',
				[UploadErrorsEnum.PATHNAME_MISSING]: 'Chybajucí cesta',
				[UploadErrorsEnum.PATHNAME_INVALID]: 'Neplatná cesta',
				[UploadErrorsEnum.NO_ONES]: 'Zložky nie boli vybrane',
				[UploadErrorsEnum.TOO_LARGE]: 'Zložka je prevelka',
				[UploadErrorsEnum.ALREADY_EXISTS]: 'Zložka uz existuje',
				[UploadErrorsEnum.METADATA_MISMATCH]: 'Nesovpad metadatov',
				[UploadErrorsEnum.INVALID_METADATA]: 'Neplatne metadaty',
				[UploadErrorsEnum.UNSUPPORTED_FILE_TYPE]: 'Nemožno zobraziť zložku',
				[UploadErrorsEnum.INVALID_NAME]: 'Neplatné meno zložky'
			}
		},
		messages: {
			copied: 'Skopiran',
			renamed: 'Premenovan',
			deleted: 'Zmazan',
			copiedLink: 'Odkaz skopirano',
			downloaded: 'Nahran'
		},
		upload: {
			title: 'Nahrať nové súbory',
			choose: 'Vybrať súbory',
			upload: 'Nahrať',
			savedFiles: 'Uložené súbory',
			success: 'Súbory uspešne nahrané',
			error: {
				[UploadErrorsEnum.SOMETHING_WENT_WRONG]: 'Nastala chyba',
				[UploadErrorsEnum.PATHNAME_MISSING]: 'Chybajucí cesta',
				[UploadErrorsEnum.PATHNAME_INVALID]: 'Neplatná cesta',
				[UploadErrorsEnum.NO_ONES]: 'Súbory nebol vybraný',
				[UploadErrorsEnum.TOO_LARGE]: 'Súbory prevelke',
				[UploadErrorsEnum.ALREADY_EXISTS]: 'Súbory už existujú',
				[UploadErrorsEnum.METADATA_MISMATCH]: 'Nesovpad metadatov',
				[UploadErrorsEnum.INVALID_METADATA]: 'Neplatne metadaty',
				[UploadErrorsEnum.UNSUPPORTED_FILE_TYPE]: 'Nemožno zobraziť súbor',
				[UploadErrorsEnum.INVALID_NAME]: 'Neplatné meno zložky'
			},
			maxSize: 'Maximalna velkost súborov je 100 MB'
		},
		files: {
			title: 'Vaše súbory',
			newFolder: 'Vytvoriť novú zložku',
			file: 'Súbor',
			noFiles: 'Žiadne súbory tu',
			size: {
				size: 'Velkost',
				b: 'B',
				kb: 'KB',
				mb: 'MB',
				gb: 'GB'
			}
		},
		contextmenu: {
			open: 'Otvoriť',
			rename: 'Premenovať',
			delete: 'Vymazať',
			copy: 'Kopírujúť odkaz',
			save: 'Uložiť'
		},
		settings: {
			language: 'Jazyk',
			theme: {
				theme: 'Téma',
				mode: {
					dark: 'Tmava',
					light: 'Svetla'
				}
			}
		}
	}
}

export interface ITextDictionary {
	en: ITDItem
	ru: ITDItem
	uk: ITDItem
	sk: ITDItem
}

export interface IUpload {
	title: string
	choose: string
	upload: string
	success: string
	savedFiles: string
	error: Record<UploadErrorsEnum, string>
	maxSize: string
}

export interface ISize {
	size: string
	b: string
	kb: string
	mb: string
	gb: string
}

export interface IFiles {
	title: string
	file: string
	newFolder: string
	noFiles: string
	size: ISize
}

export interface IContextMenu {
	open: string
	rename: string
	delete: string
	copy: string
	save: string
}

export interface ITheme {
	theme: string
	mode: IThemeMode
}

export interface IThemeMode {
	dark: string
	light: string
}

export interface ISettings {
	language: string
	theme: ITheme
}

export interface IMessages {
	copied: string
	copiedLink: string
	renamed: string
	deleted: string
	downloaded: string
}

export interface ITree {
	name: string
	folder: string
	size: string
	modified: string
	uploadedAt: string
	successCreated: string
	errors: Record<UploadErrorsEnum, string>
}

export interface ITDItem {
	lang: string
	title: string
	description: string
	settings: ISettings
	upload: IUpload
	tree: ITree
	files: IFiles
	messages: IMessages
	contextmenu: IContextMenu
	developedBy: string
}

export default TextDictionary
