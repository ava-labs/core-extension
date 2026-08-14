import type { Compilation, WebpackPluginInstance } from '@rspack/core';
export function sesPrefixFiles({
  compilation,
  inlineLockdown,
}: {
  compilation: Compilation;
  inlineLockdown: RegExp;
}): () => void;
export function sesEmitHook({
  compilation,
  htmlTemplatePlugin,
  htmlTemplatePluginInterop,
}: {
  compilation: Compilation;
  htmlTemplatePlugin?: WebpackPluginInstance | undefined;
  htmlTemplatePluginInterop?: boolean | undefined;
}): () => void;
