import { GlobeIcon, styled } from '@avalabs/k2-components';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';

export const GlobeIconContainer = styled('div')<NetworkLogoProps>`
  width: auto;
  height: ${({ height }) => height ?? '32px'};
  position: ${({ position }) => position ?? 'static'};
	margin: ${({ margin }) => margin ?? '0'};
  top: 0;
  left: 0;
  background-color: 'grey.800',
  border-radius: 50%;
`;

interface NetworkLogoProps {
  src?: string;
  width?: string;
  height?: string;
  position?: string;
  padding?: string;
  margin?: string;
}

const NetworkLogoImage = styled('img')<NetworkLogoProps>`
  width: auto;
  height: ${({ height }) => height ?? '32px'};
  position: ${({ position }) => position ?? 'static'};
  margin: ${({ margin }) => margin ?? '0'};
  top: 0;
  left: 0;
`;

export function NetworkLogoK2({
  src,
  height,
  position,
  margin,
}: NetworkLogoProps) {
  return (
    <>
      {src ? (
        <NetworkLogoImage
          height={height}
          src={ipfsResolverWithFallback(src)}
          position={position}
          margin={margin}
        ></NetworkLogoImage>
      ) : (
        <GlobeIconContainer height={height} position={position} margin={margin}>
          <GlobeIcon size={height} sx={{ p: 0 }} />
        </GlobeIconContainer>
      )}
    </>
  );
}
