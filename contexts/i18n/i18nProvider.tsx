'use client'
import { DictionaryType } from "@/lib/get-dictionary";
import { createContext, ReactNode, useContext } from "react";

interface I18nContextType {
    dictionaryEN: DictionaryType
    dictionaryVI: DictionaryType
}
interface I18nProviderProps {
    children: ReactNode;
    dictionaryVI: DictionaryType
    dictionaryEN: DictionaryType
}

const i18nContext = createContext<I18nContextType | null>(null)

export const I18nProvider = ({ children, dictionaryEN, dictionaryVI }: I18nProviderProps) => {
    const value = {
        dictionaryEN,
        dictionaryVI
    }
    return <i18nContext.Provider value={value}>{children}</i18nContext.Provider>
}


export const useI18n = (lang: string) => {
    const I18n = useContext(i18nContext)
    if (!I18n) {
        throw new Error('useI18n must be used within I18nProvider')
    }
    switch (lang) {
        case 'vi':
            return I18n.dictionaryVI
        case 'en':
            return I18n.dictionaryEN
        default:
            return I18n.dictionaryEN
    }
}