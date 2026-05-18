/** Show a short prefix; hide the rest for list views after the key was created. */
export function maskApiKey(apiKey: string, visiblePrefix = 12): string {
  if (!apiKey) return "••••••••";
  if (apiKey.length <= visiblePrefix) {
    return `${apiKey.slice(0, 4)}${"•".repeat(Math.max(apiKey.length - 4, 4))}`;
  }
  return `${apiKey.slice(0, visiblePrefix)}${"•".repeat(8)}`;
}
