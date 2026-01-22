export function nocache(url: string): string {
  if (!url) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}_t=${Date.now()}`
}
