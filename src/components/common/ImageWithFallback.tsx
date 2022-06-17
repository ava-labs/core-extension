import { ImgHTMLAttributes, useState } from 'react';

export function ImageWithFallback({
  src,
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [fallbackImage, setFallbackImage] = useState('');
  const { width, height } = props;

  const imageOnErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setFallbackImage('images/no_image.png');
    onError?.(event);
  };
  return (
    <img
      src={fallbackImage || src}
      onError={imageOnErrorHandler}
      width={width}
      height={height}
    />
  );
}
