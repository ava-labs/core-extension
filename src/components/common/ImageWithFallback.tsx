import { ReactEventHandler, useState } from 'react';

interface ImageWithFallbackProps {
  src?: string;
  onError?: ReactEventHandler;
  className?: string;
}

export function ImageWithFallback({
  src,
  onError,
  className,
}: ImageWithFallbackProps) {
  const [fallbackImage, setFallbackImage] = useState('');

  const imageOnErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setFallbackImage('images/no_image.svg');
    onError?.(event);
  };
  return (
    <img
      crossOrigin="anonymous"
      src={fallbackImage || src}
      onError={imageOnErrorHandler}
      className={className}
    />
  );
}
