export const readCoreCliArgument = (lookup: string) => {
  return process.argv
    .slice(2)
    .find((arg) => arg.startsWith(`--core-${lookup}`))
    ?.split('=')[1];
};
