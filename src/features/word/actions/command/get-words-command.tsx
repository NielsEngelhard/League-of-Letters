"use server"

import { SupportedLanguage } from "@/features/i18n/languages";

export default async function GetWordsCommand(wordLength: number, amount: number, language: SupportedLanguage): Promise<string[]> {
    var list: string[] = [];

    for(var i=0; i<amount; i++) {
        list.push("waters");
    }

    return list;
}