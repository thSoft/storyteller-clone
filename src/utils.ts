export function toFirstUpper(string: string | undefined): string {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}
