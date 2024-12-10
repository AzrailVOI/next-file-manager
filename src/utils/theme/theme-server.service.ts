import {cookies} from "next/headers";
import type {IThemeMode} from "@/constants/dictionary";

export const getServerTheme = async (): Promise<keyof IThemeMode> => {
    'use server'
    const cookieStore = await cookies()
    const theme = cookieStore.get('theme')?.value as keyof IThemeMode
    return theme || 'light'
}

