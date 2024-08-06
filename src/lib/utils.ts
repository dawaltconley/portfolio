export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]/g, '-');
}
