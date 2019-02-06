//FIXME guessing game upon invalid input, wtf
export function extractNumber(s?: string): string {
  if (!s) return "";
  return s.replace(/([^\.\d])/g, "");
}

export function isExternalUrl(s: string): boolean {
  return /^https?:\/\//.test(s);
}
