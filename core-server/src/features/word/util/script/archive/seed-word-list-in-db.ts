import { officialWordsLanguageTableMap } from '@/drizzle/schema';
import { DbOrTransaction } from '@/drizzle/util/transaction-util';
import { SupportedLanguage } from '@/features/i18n/languages';
import * as fs from 'fs';
import * as readline from 'readline';
import { WordFormatValidator } from '../../word-format-validator/word-format-validator';
import { sql } from 'drizzle-orm';
import { ALLOWED_NORMAL_AND_SPECIAL_CHARACTERS } from '@/features/game/game-constants';
import { parseWordLine } from '../parse-wordlist-line';

export async function seedWordListInDb(wordListPath: string, language: SupportedLanguage, db: DbOrTransaction): Promise<void> {
  try {
    // Create a readable stream from the input file
    const fileStream = fs.createReadStream(wordListPath);
    
    // Create readline interface
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const table = officialWordsLanguageTableMap[language];
    
    // Process each line
    for await (const line of rl) {
        try {
          const parsedLine = parseWordLine(line);

          const word = parsedLine.word;
          const definition = parsedLine.definition;

          const validateWordResponse = WordFormatValidator.validateFormat(word, ALLOWED_NORMAL_AND_SPECIAL_CHARACTERS);

          if (validateWordResponse.isValid == true) {
            

            // Add to database
            await db.insert(table).values({
                word: word,
                definition: definition,
                length: validateWordResponse.word.length,            
            }).onConflictDoNothing();
                    
          } else {
            // Invalid word format
          }; 
        }
        catch (e) {
          console.log(e);
        }
    }

    const nRecordsInDbTable = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(table);

    console.log(`Table now contains ${nRecordsInDbTable[0].count} records`);
  } catch (error) {
    console.error('Error seeding word list file:', error);
  }
}