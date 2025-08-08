export async function copyToClipboard(input: string | undefined | null) {
    if (!input) return;
    await navigator.clipboard.writeText(input);
}