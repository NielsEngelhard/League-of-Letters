export function getCurrentUtcUnixTimestamp_Seconds(): number {
    return Math.floor(Date.now() / 1000); // Current Unix timestamp
}

export function getSecondsBetweenNowAndUnixTimestampInSeconds(unixTimestamp: number | null | undefined): number | undefined {
    if (!unixTimestamp) return undefined;

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return now - unixTimestamp;
}