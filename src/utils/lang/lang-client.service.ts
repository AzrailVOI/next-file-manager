import type {ITextDictionary} from "@/constants/dictionary";
import {COOKIE_MAX_AGE} from "@/constants/cookie.constants";

export async function setLang(lang: keyof ITextDictionary): Promise<void> {
    'use client'
    document.cookie = `lang=${lang}; max-age=${COOKIE_MAX_AGE}; path=/;`
    return
}