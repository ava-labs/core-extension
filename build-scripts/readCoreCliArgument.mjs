export const readCoreCliArgument = (lookup) => {
  return process.argv
    .slice(2)
    .find((arg) => arg.startsWith(`--core-${lookup}`))
    ?.split('=')[1];
};
