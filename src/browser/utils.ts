type ClipPath = [number, number][];
const pathToClip = (path: ClipPath): string =>
  path
    .map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`)
    .join(', ');

export type { ClipPath };
export { pathToClip };
