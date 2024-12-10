import {cookies} from "next/headers";
import type {ITextDictionary} from "@/constants/dictionary";

export async function getServerLang(): Promise<keyof ITextDictionary> {
    'use server'
    const cookieStore = await cookies()
    const lang = cookieStore.get('lang')?.value as keyof ITextDictionary
    return lang || 'en'
}

