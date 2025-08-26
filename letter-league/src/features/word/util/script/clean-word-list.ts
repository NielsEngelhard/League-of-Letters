import * as fs from 'fs';
import * as readline from 'readline';
import { WordFormatValidator } from '../word-format-validator/word-format-validator';
import { ALLOWED_NORMAL_AND_SPECIAL_CHARACTERS } from '@/features/game/game-constants';

export async function cleanWordList(inputPath: string, outputPath: string): Promise<void> {
  try {
    // Create a readable stream from the input file
    const fileStream = fs.createReadStream(inputPath);
    
    // Create readline interface
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    // Array to store lines that pass the filter
    const filteredLines: string[] = [];
    
    // Process each line
    for await (const line of rl) {
      const validateWordResponse = WordFormatValidator.validateFormat(line, ALLOWED_NORMAL_AND_SPECIAL_CHARACTERS);
      
      if (validateWordResponse.isValid == true) {
        filteredLines.push(validateWordResponse.word);
      } else {
        // Invalid word format
      }; 
    }
    
    // Write the filtered content back to the output file
    fs.writeFileSync(outputPath, filteredLines.join('\n'));
    
    console.log(`Processing complete. Results written to ${outputPath} length ${filteredLines.length}`);
  } catch (error) {
    console.error('Error processing file:', error);
  }
}