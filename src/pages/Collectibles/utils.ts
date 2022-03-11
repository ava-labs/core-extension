export const isVideo = (url: string) =>
  ['.mp4', '.webm', '.ogg'].includes(url.slice(url.lastIndexOf('.')));
