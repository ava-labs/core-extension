import { HorizontalFlex, PlayIcon } from '@avalabs/react-components';
import { useState } from 'react';
import styled from 'styled-components';
import { isVideo } from '../utils';
import { ImageWrapper } from './ImageWrapper';

const NftImage = styled.img<{
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  hover?: boolean;
  hasBorderRadius?: boolean;
}>`
  width: ${({ width }) => width ?? '32px'};
  max-width: ${({ maxWidth }) => maxWidth ?? 'unset'};
  height: ${({ height }) => height ?? '32px'};
  max-height: ${({ maxHeight }) => maxHeight ?? 'unset'};
  border: 1px solid ${({ theme }) => `${theme.colors.bg1}1A`};
  box-sizing: border-box;
  filter: drop-shadow(0px 10px 25px ${({ theme }) => `${theme.colors.bg1}40`});
  backdrop-filter: blur(25px);
  border-radius: ${({ hasBorderRadius }) => (hasBorderRadius ? '8px' : 'none')};
  cursor: pointer;

  ${({ hover }) =>
    hover &&
    `
        &:hover {
            filter: grayscale(100%);
        }
  `};
`;

const NftVideo = styled.video<{
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  hover?: boolean;
}>`
  width: ${({ width }) => width ?? '32px'};
  max-width: ${({ maxWidth }) => maxWidth ?? 'unset'};
  height: ${({ height }) => height ?? '32px'};
  max-height: ${({ maxHeight }) => maxHeight ?? 'unset'};
  border: 1px solid ${({ theme }) => `${theme.colors.bg1}1A`};
  box-sizing: border-box;
  filter: drop-shadow(0px 10px 25px ${({ theme }) => `${theme.colors.bg1}40`});
  backdrop-filter: blur(25px);
  border-radius: 8px;

  ${({ hover }) =>
    hover &&
    `
        &:hover {
            filter: grayscale(100%);
        }
  `};
`;

const StyledPlayIcon = styled(PlayIcon)`
  position: absolute;
  bottom: 8px;
  right: 8px;
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
}: CollectibleMediaProps) {
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);

  return (
    <HorizontalFlex margin={margin} className={className}>
      {isVideo(url) ? (
        <HorizontalFlex position="relative">
          <NftVideo
            width={width}
            height={height}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            hover={hover}
            controls={controls}
          >
            <source src={url} />
          </NftVideo>
          {showPlayIcon && <StyledPlayIcon />}
        </HorizontalFlex>
      ) : (
        <ImageWrapper
          isOverlay={isImageFullScreen}
          onClick={() => setIsImageFullScreen(true)}
          onClose={() => setIsImageFullScreen(false)}
        >
          <NftImage
            width={width}
            height={height}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            hover={hover}
            src={url}
            hasBorderRadius={!isImageFullScreen}
          />
        </ImageWrapper>
      )}
    </HorizontalFlex>
  );
}
