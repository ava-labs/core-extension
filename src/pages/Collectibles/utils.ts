export const isVideo = (url?: string) =>
  url && ['.mp4', '.webm', '.ogg'].includes(url.slice(url.lastIndexOf('.')));

export const isImageDark = (
  img: HTMLImageElement,
  callback: (b: boolean) => void,
) => {
  let colorSum = 0;

  if (!img) {
    // Default value is true (Dark image Mode)
    return callback(true);
  }

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      // Default value is true (Dark image Mode)
      return callback(true);
    }

    ctx.drawImage(img, 0, 0);

    // we need to know the top right quater's average color
    const height = Math.floor(canvas.height / 2);
    const width = Math.floor(canvas.width / 2);
    const imageData = ctx.getImageData(width, 0, width, height);
    const data = imageData.data;

    for (let x = 0, len = data.length; x < len; x += 4) {
      const r = data[x];
      const g = data[x + 1];
      const b = data[x + 2];

      if (r === undefined || g === undefined || b === undefined) {
        throw new Error('Undefined color');
      }

      const avg = Math.floor((r + g + b) / 3);
      colorSum += avg;
    }

    const brightness = Math.floor(colorSum / (width * height));
    //Brightness is out of 255.
    return callback(brightness < 127.5);
  } catch {
    // Default value is true (Dark image Mode)
    return callback(true);
  }
};
