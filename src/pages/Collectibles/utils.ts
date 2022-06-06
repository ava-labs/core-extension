export const isVideo = (url?: string) =>
  url && ['.mp4', '.webm', '.ogg'].includes(url.slice(url.lastIndexOf('.')));
