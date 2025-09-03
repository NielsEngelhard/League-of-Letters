export function getCurrentUtcUnixTimestamp_Seconds(): number {
    return Math.floor(Date.now() / 1000); // Current Unix timestamp
}

export function getSecondsBetweenNowAndUnixTimestampInSeconds(unixTimestamp: number | null | undefined): number | undefined {
    if (!unixTimestamp) return undefined;

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return now - unixTimestamp;
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}min`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}