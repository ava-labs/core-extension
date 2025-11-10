export const sanitizeDappUrl = (url: string) => {
  const urlObject = new URL(url);
  return `${urlObject.protocol}//${urlObject.hostname}`;
};
