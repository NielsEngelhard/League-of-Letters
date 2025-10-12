export interface DictionaryEntry {
  word: string;
  definition?: string;
}

// Supports input in the following formats:
// word
// word - definition
export function parseWordLine(input: string): DictionaryEntry {
  const trimmed = input.trim();
  
  // Find the first ' - ' separator
  const separatorIndex = trimmed.indexOf(' - ');
  
  if (separatorIndex === -1) {
    // No separator found, return just the word
    return {
      word: trimmed
    };
  }
  
  // Split by the separator
  const word = trimmed.substring(0, separatorIndex).trim();
  const definition = trimmed.substring(separatorIndex + 3).trim();
  
  return {
    word,
    definition: definition || undefined
  };
}