export = RspackNmfGeneratorHookPolyfillPlugin;
declare class RspackNmfGeneratorHookPolyfillPlugin {
  /** @param {import('@rspack/core').Compiler} compiler */
  apply(compiler: import('@rspack/core').Compiler): void;
}
declare namespace RspackNmfGeneratorHookPolyfillPlugin {
  export { RspackNmfGeneratorHookPolyfillPlugin, PLUGIN_NAME };
}
declare const PLUGIN_NAME: string;
