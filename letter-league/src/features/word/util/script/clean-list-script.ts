import { cleanWordList } from "./clean-word-list";

const FILE_INPUT_PATH = "./public/word-lists/nl/unclean-list.txt";
const FILE_OUTPUT_PATH = "./public/word-lists/nl/nl-clean-words-complete.txt";

// Clean a txt file with words on each row (create new file with words that are valid)
async function cleanWordLists() {
    console.log('🌱 Start cleaning word lists');

    try {
        await cleanWordList(
            FILE_INPUT_PATH,
            FILE_OUTPUT_PATH, 
        );
        console.log(`✅ Successfully cleaned ${FILE_INPUT_PATH}`);
    } catch(error) {
        console.error(`❌ Cleaning of ${FILE_INPUT_PATH} failed:`, error);
    }
}

cleanWordLists();