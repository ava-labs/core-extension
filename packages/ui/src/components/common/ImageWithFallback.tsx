import { ipfsResolverWithFallback } from '@core/common';
import { ReactEventHandler, useState } from 'react';

interface ImageWithFallbackProps {
  src?: string;
  onError?: ReactEventHandler;
  onLoad?: ReactEventHandler;
  className?: string;
  id?: string;
}

export function ImageWithFallback({
  src,
  onError,
  onLoad,
  className,
  id,
}: ImageWithFallbackProps) {
  const [fallbackImage, setFallbackImage] = useState('');

  const imageOnErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    setFallbackImage('images/no_image.svg');
    onError?.(event);
  };
  return (
    <img
      crossOrigin="anonymous"
      src={fallbackImage || ipfsResolverWithFallback(src)}
      onError={imageOnErrorHandler}
      onLoad={(event) => {
        onLoad?.(event);
      }}
      className={className}
      id={id}
    />
  );
}
