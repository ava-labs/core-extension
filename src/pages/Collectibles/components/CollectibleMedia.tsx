import { useState } from 'react';
import { isVideo } from '../utils';
import { ImageWrapper } from './ImageWrapper';
import { ImageWithFallback } from '@src/components/common/ImageWithFallback';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';
import { Stack, styled, TriangleRightIcon } from '@avalabs/k2-components';

const NftImage = styled(ImageWithFallback)<{
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  hover?: boolean;
  hasBorderRadius?: boolean;
  boarderRadius?: string;
}>`
  width: ${({ width }) => width ?? '32px'};
  height: ${({ height }) => height ?? '32px'};
  max-width: ${({ maxWidth }) => maxWidth ?? 'unset'};
  max-height: ${({ maxHeight }) => maxHeight ?? 'unset'};
  border: 1px solid ${({ theme }) => `${theme.palette.common.black}1A`};
  box-sizing: border-box;
  filter: drop-shadow(
    0px 10px 25px ${({ theme }) => `${theme.palette.common.black}40`}
  );
  backdrop-filter: blur(25px);
  border-radius: ${({ hasBorderRadius, boarderRadius }) =>
    hasBorderRadius ? (boarderRadius ? boarderRadius : '8px') : 'none'};
  cursor: pointer;

  ${({ hover }) =>
    hover &&
    `
        &:hover {
            filter: grayscale(100%);
        }
  `};
`;

const NftVideo = styled('video')<{
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  hover?: boolean;
  boarderRadius?: string;
}>`
  width: ${({ width }) => width ?? '32px'};
  max-width: ${({ maxWidth }) => maxWidth ?? 'unset'};
  height: ${({ height }) => height ?? '32px'};
  max-height: ${({ maxHeight }) => maxHeight ?? 'unset'};
  border: 1px solid ${({ theme }) => `${theme.palette.common.black}1A`};
  box-sizing: border-box;
  filter: drop-shadow(
    0px 10px 25px ${({ theme }) => `${theme.palette.common.black}40`}
  );
  backdrop-filter: blur(25px);
  border-radius: ${({ boarderRadius }) =>
    boarderRadius ? boarderRadius : '8px'};
  ${({ hover }) =>
    hover &&
    `
        &:hover {
            filter: grayscale(100%);
        }
  `};
`;

interface CollectibleMediaProps {
  url?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  hover?: boolean;
  margin?: string;
  showPlayIcon?: boolean;
  controls?: boolean;
  className?: string;
  boarderRadius?: string;
}

export function CollectibleMedia({
  url,
  width,
  height,
  maxWidth,
  maxHeight,
  hover = false,
  margin,
  showPlayIcon = true,
  controls = false,
  className,
  boarderRadius = '8x',
}: CollectibleMediaProps) {
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);

  return (
    <Stack
      sx={{
        margin,
        flexDirection: 'row',
      }}
      className={className}
    >
      {isVideo(url) ? (
        <Stack sx={{ position: 'relative', flexDirection: 'row' }}>
          <NftVideo
            width={width}
            height={height}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            hover={hover}
            controls={controls}
            boarderRadius={boarderRadius}
          >
            <source src={ipfsResolverWithFallback(url)} />
          </NftVideo>
          {showPlayIcon && (
            <TriangleRightIcon
              sx={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                color: 'common.white',
              }}
            />
          )}
        </Stack>
      ) : (
        <ImageWrapper
          isOverlay={isImageFullScreen}
          onClick={() => setIsImageFullScreen(true)}
          onClose={() => setIsImageFullScreen(false)}
        >
          <NftImage
            width={isImageFullScreen ? '100%' : width}
            height={isImageFullScreen ? 'auto' : height}
            src={url}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            hover={hover}
            hasBorderRadius={!isImageFullScreen}
            boarderRadius={boarderRadius}
          />
        </ImageWrapper>
      )}
    </Stack>
  );
}
