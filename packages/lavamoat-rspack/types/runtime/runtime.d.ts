export type WebpackRequire = (specifier: string) => any;
export type WrappedRequire = WebpackRequire & {
  [key: string]: any;
};
