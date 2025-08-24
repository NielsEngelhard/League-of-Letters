// Delay a function
export function waitDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}