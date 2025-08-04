export function generateGameId(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

export function parseGameId(input: string): string {
  const uppercaseInput = input.toUpperCase();
  
  // Check if the input contains only valid characters (letters and numbers)
  if (!/^[A-Z0-9]+$/.test(uppercaseInput)) {
    throw new Error('Game ID can only contain letters and numbers');
  }
  
  return uppercaseInput;
}

export function generateWodGameId(userId: string) {
  return `wod-${userId}`;
}