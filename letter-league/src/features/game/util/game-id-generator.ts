export const GAME_ID_LENGTH = 6;
export const GAME_ID_REGEX = /^[A-Z0-9]+$/;

export function generateGameId(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < GAME_ID_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

export function parseGameId(input: string): string {
  const uppercaseInput = input.toUpperCase();
  
  // Check if the input contains only valid characters (letters and numbers)
  if (!GAME_ID_REGEX.test(uppercaseInput)) {
    throw new Error('Game ID can only contain letters and numbers');
  }
  
  return uppercaseInput;
}

export function isValidGameId(input: string): boolean {
  if (input.length != GAME_ID_LENGTH) return false;
  
  return GAME_ID_REGEX.test(input);
}