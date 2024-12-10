import {ITextDictionary, IThemeMode} from "@/constants/dictionary";

export interface ICookies {
    lang: keyof ITextDictionary
    theme: keyof IThemeMode
}