export function wrapper({
  source,
  id,
  runtimeKit,
  evalKitFunctionName,
  runChecks,
  runtimeFlags,
}: WrappingInput): {
  before: string;
  after: string;
  source: string;
  sourceChanged: boolean;
};
/**
 * Flags enabling runtime features based on webpack's runtime requirements.
 * Using this decouples the concept of runtime requirements from wrapper.
 */
export type RuntimeFlags = {
  thisAsExports?: boolean | undefined;
};
export type WrappingInput = {
  source: string;
  id: string;
  runtimeKit: string[] | Set<string>;
  evalKitFunctionName: string;
  runChecks?: boolean | undefined;
  runtimeFlags?: RuntimeFlags | undefined;
};
