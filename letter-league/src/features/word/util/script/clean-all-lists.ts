import { cleanWordList } from "./clean-word-list";

async function cleanWordLists() {
    console.log('🌱 Start cleaning word lists');

    const wordListLengths = [5, 6, 7, 8, 9, 10, 11, 12];
    const languages = ["nl"];

    for(var i=0; i<wordListLengths.length; i++) {
        for(var j=0; j<languages.length; j++) {
            const wordLength = wordListLengths[i];
            const language = languages[j];

            const fileName = `${language}-${wordLength}.txt`;

            const fileToCleanPath = `./public/word-lists/${language}/${fileName}`;
            const newCleanedFilePath = `./public/word-lists/${language}/cleaned-${fileName}`;
            
            try {
                await cleanWordList(
                    fileToCleanPath,
                    newCleanedFilePath, 
                    wordLength
                );
                console.log(`✅ Successfully cleaned ${fileName}`);
            } catch(error) {
                console.error(`❌ Cleaning of ${fileName} failed:`, error);
            }
        }
    }
}

cleanWordLists();