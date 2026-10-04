export function djb2(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return h >>> 0;
}

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
