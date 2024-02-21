declare module 'smartquotes' {
  type F = (string: string) => string;

  interface Smartquotes extends F {
    string: F;
  }

  const smartquotes: Smartquotes;

  export default smartquotes;
}
