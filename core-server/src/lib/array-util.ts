export function last<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

// Fisher–Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]; // copy so original is not modified
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]; // swap
  }
  return result;
}