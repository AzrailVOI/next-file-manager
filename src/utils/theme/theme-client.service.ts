import {IThemeMode} from "@/constants/dictionary";
import {COOKIE_MAX_AGE} from "@/constants/cookie.constants";

export async function setClientTheme(theme: keyof IThemeMode): Promise<void> {
    'use client'
    document.cookie = `theme=${theme}; max-age=${COOKIE_MAX_AGE}; path=/;`
    return
}