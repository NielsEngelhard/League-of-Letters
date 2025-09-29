export function getCurrentUtcDate(): Date {
  const utcTimestamp = Date.now(); // Returns UTC milliseconds since epoch
  const utcDate = new Date(utcTimestamp);

  return utcDate;
}

export function getCurrentUtcDatePlusSeconds(seconds: number): Date {
  return new Date(getCurrentUtcDate().getTime() + (seconds) * 1000);
}

export function msToSeconds(ms: number): number {
  return ms / 1000;
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