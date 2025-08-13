import * as fs from 'fs';
import * as readline from 'readline';

export async function cleanWordList(inputPath: string, outputPath: string, wordLength: number): Promise<void> {
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
      // Trim the line to remove leading/trailing whitespace
      const trimmedLine = line.trim();
      
      // Skip empty lines or lines with only whitespace
      if (trimmedLine === '') {
        continue;
      }
      
      // Check the length of the line
      const length = trimmedLine.length;
      
      if (length === wordLength + 1) {
        console.log(`${trimmedLine}`);
      } else if (length === wordLength) {
        filteredLines.push(trimmedLine);
      }
    }
    
    // Write the filtered content back to the output file
    fs.writeFileSync(outputPath, filteredLines.join('\n'));
    
    console.log(`Processing complete. Results written to ${outputPath}`);
  } catch (error) {
    console.error('Error processing file:', error);
  }
}