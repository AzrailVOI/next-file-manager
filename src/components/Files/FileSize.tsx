import TextDictionary, {ITextDictionary} from "@/constants/dictionary";

interface FileSizeProps {
    size: number
    lang: keyof ITextDictionary
}

export const FileSize = ({size, lang}: FileSizeProps) => {
    return (
        <>
            {size < 1024
                ? size + TextDictionary[lang].files.size.b
                : size < 1024 * 1024
                    ? (size / 1024).toFixed(2) + TextDictionary[lang].files.size.kb
                    : size < 1024 * 1024 * 1024
                        ? (size / 1024 / 1024).toFixed(2) + TextDictionary[lang].files.size.mb
                        : (size / 1024 / 1024 / 1024).toFixed(2) + TextDictionary[lang].files.size.gb}
        </>
    )
}