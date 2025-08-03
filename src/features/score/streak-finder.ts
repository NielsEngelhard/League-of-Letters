/**
 * Class to find numerical "streaks" in an array.
 * A streak is a group of at least N consecutive numbers, regardless of order.
 */
export class StreakFinder {
  /**
   * Finds all streaks of consecutive numbers that meet a minimum length.
   * @param numbers - Input array of numbers (unordered).
   * @param minLength - Minimum length a streak must have (default: 3).
   * @returns An array of streaks (each sorted), e.g. [[1,2,3], [7,8,9]].
   */
  public static findStreaks(numbers: number[], minLength: number = 3): number[][] {
    const streaks: number[][] = [];
    const unique = [...new Set(numbers)];
    const seen = new Set<number>();

    for (const num of unique) {
      if (seen.has(num)) continue;

      const streak = [num];
      seen.add(num);

      // Expand downward
      let down = num - 1;
      while (unique.includes(down)) {
        streak.push(down);
        seen.add(down);
        down--;
      }

      // Expand upward
      let up = num + 1;
      while (unique.includes(up)) {
        streak.push(up);
        seen.add(up);
        up++;
      }

      if (streak.length >= minLength) {
        streaks.push(streak.sort((a, b) => a - b));
      }
    }

    return streaks;
  }
}
