export function splitStringInMiddle(str: string): string {
  const middle = Math.floor(str.length / 2);
  return str.slice(0, middle) + '-' + str.slice(middle);
}
