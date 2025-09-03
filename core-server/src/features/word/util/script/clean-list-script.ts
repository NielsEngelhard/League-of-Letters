import { supportedLanguages } from "@/features/i18n/languages";
import { cleanWordList } from "./clean-word-list";

const LANGUAGE_PLACEHOLDER = "{LANGUAGE_HERE}";
const FILE_INPUT_PATH_WITH_PLACEHOLDER = `./public/word-lists/${LANGUAGE_PLACEHOLDER}/unclean-list.txt`;
const FILE_OUTPUT_PATH_WITH_PLACEHOLDER = `./public/word-lists/${LANGUAGE_PLACEHOLDER}/${LANGUAGE_PLACEHOLDER}-clean-words-full.txt`;

// Clean a txt file with words on each row (create new file with words that are valid)
async function cleanWordLists() {
    console.log('START cleaning word lists');

    for(let i=0; i<supportedLanguages.length; i++) {
        const language = supportedLanguages[i];

        console.log(`🧼🫧🧺🧽🧹 cleaning word list for '${language}'`);

        const FILE_INPUT_PATH = FILE_INPUT_PATH_WITH_PLACEHOLDER.replaceAll(LANGUAGE_PLACEHOLDER, language);
        const FILE_OUTPUT_PATH = FILE_OUTPUT_PATH_WITH_PLACEHOLDER.replaceAll(LANGUAGE_PLACEHOLDER, language);

        try {
            await cleanWordList(
                FILE_INPUT_PATH,
                FILE_OUTPUT_PATH, 
            );
            console.log(`✅🧼 Successfully cleaned ${FILE_INPUT_PATH}`);
        } catch(error) {
            console.error(`❌ Cleaning of ${FILE_INPUT_PATH} failed:`, error);
        }        
    }
}

cleanWordLists();