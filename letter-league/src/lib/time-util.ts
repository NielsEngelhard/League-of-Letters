export function getCurrentUtcUnixTimestamp_Seconds(): number {
    return Math.floor(Date.now() / 1000); // Current Unix timestamp
}