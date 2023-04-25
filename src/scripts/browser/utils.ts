export const coerceToArray = <T>(x: T[] | T): T[] =>
  Array.isArray(x) ? x : [x];

export const shuffle = <T>(arr: T[]): T[] => {
  const len = arr.length;
  const remaining: T[] = [...arr];
  const shuffled: T[] = [];
  while (shuffled.length < len) {
    const i = Math.floor(Math.random() * remaining.length);
    const item = remaining.splice(i, 1)[0];
    shuffled.push(item);
  }
  return shuffled;
};

export type ClipPath = [number, number][];
export const pathToClip = (path: ClipPath): string =>
  path
    .map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`)
    .join(', ');
