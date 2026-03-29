declare function require(path: string): string;

declare module '*.jpg' {
  const value: string;
  export = value;
}
