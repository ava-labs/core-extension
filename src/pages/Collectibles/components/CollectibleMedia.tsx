import { useState } from 'react';
import { isVideo, isImageDark } from '../utils';
import { ImageWrapper } from './ImageWrapper';
import { ImageWithFallback } from '@src/components/common/ImageWithFallback';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';
import {
  Chip,
  Stack,
  styled,
  TriangleRightIcon,
  ArrowsMaximizeIcon,
} from '@avalabs/k2-components';
import BN from 'bn.js';

const NftImage = styled(ImageWithFallback)<{
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  hover?: boolean;
  hasBorderRadius?: boolean;
  borderRadius?: string;
  showPointer?: boolean;
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
  border-radius: ${({ hasBorderRadius, borderRadius }) =>
    hasBorderRadius ? borderRadius ?? '8px' : 'none'};
  cursor: ${({ showPointer }) => (showPointer ? 'default' : 'pointer')};
`;

const NftVideo = styled('video')<{
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  hover?: boolean;
  borderRadius?: string;
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
  border-radius: ${({ borderRadius }) => borderRadius ?? '8px'};
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
  borderRadius?: string;
  showBalance?: boolean;
  balance?: BN;
  showExpandOption?: boolean;
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
  borderRadius = '8px',
  showBalance = false,
  balance = new BN(0),
  showExpandOption = false,
}: CollectibleMediaProps) {
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [shouldUseLightIcon, setShouldUseLightIcon] = useState(false);

  return (
    <Stack
      sx={{
        margin,
        flexDirection: 'row',
      }}
      className={className}
    >
      {
        <Stack
          sx={{
            flexDirection: 'row',
            maxWidth: maxWidth ? maxWidth : 'unset',
            width: width ? width : '32px',
            position: 'absolute',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            columnGap: 1,
            zIndex: 3,
            mr: 3,
            mt: 1,
            pr: 1,
          }}
        >
          {showBalance && (
            <Chip
              size="small"
              sx={{
                backgroundColor: (theme) =>
                  shouldUseLightIcon
                    ? 'primary.light'
                    : theme.palette.grey[600],
                color: shouldUseLightIcon
                  ? 'primary.contrastText'
                  : 'primary.light',
                px: 1,
              }}
              label={balance.toString()}
            />
          )}
          {showExpandOption && (
            <ArrowsMaximizeIcon
              onClick={() => {
                setIsImageFullScreen(true);
              }}
              size="24"
              sx={{
                color: shouldUseLightIcon
                  ? 'primary.light'
                  : 'primary.contrastText',
                cursor: 'pointer',
              }}
            />
          )}
        </Stack>
      }
      {isVideo(url) ? (
        <Stack sx={{ position: 'relative', flexDirection: 'row' }}>
          <NftVideo
            width={width}
            height={height}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            hover={hover}
            controls={controls}
            borderRadius={borderRadius}
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
          onClick={() => {
            if (!showBalance) setIsImageFullScreen(true);
          }}
          onClose={() => setIsImageFullScreen(false)}
          backdropImageUrl={url}
          shouldUseLightIcon={shouldUseLightIcon}
        >
          <NftImage
            width={isImageFullScreen ? '100%' : width}
            height={isImageFullScreen ? 'auto' : height}
            src={url}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            hover={hover}
            hasBorderRadius={!isImageFullScreen}
            borderRadius={borderRadius}
            showPointer={showExpandOption}
            onLoad={(event) => {
              const imageElement = event.target;
              if (imageElement instanceof HTMLImageElement) {
                isImageDark(imageElement, (isDark) => {
                  setShouldUseLightIcon(isDark);
                });
              }
            }}
          />
        </ImageWrapper>
      )}
    </Stack>
  );
}
