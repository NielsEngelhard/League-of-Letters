import { officialWordsLanguageTableMap } from '@/drizzle/schema';
import { DbOrTransaction } from '@/drizzle/util/transaction-util';
import * as fs from 'fs';
import * as readline from 'readline';

export async function seedWordListInDb(wordListPath: string, tableName: string, minWordLength: number, maxWordLength: number, db: DbOrTransaction): Promise<void> {
  try {
    // Create a readable stream from the input file
    const fileStream = fs.createReadStream(wordListPath);
    
    // Create readline interface
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    // Process each line
    for await (const line of rl) {
      // Trim the line to remove leading/trailing whitespace
      const trimmedLine = line.trim();
      
     if (trimmedLine.length >= minWordLength && trimmedLine.length <= maxWordLength) {
        db.insert(officialWordsLanguageTableMap["nl"]).values({
            word: trimmedLine,
            length: trimmedLine.length,            
        });
     }
    }
  } catch (error) {
    console.error('Error seeding word list file:', error);
  }
}