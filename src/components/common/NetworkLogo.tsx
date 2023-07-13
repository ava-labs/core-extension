import { GlobeIcon, styled } from '@avalabs/k2-components';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';

export const GlobeIconContainer = styled('div')<NetworkLogoProps>`
  width: ${({ width }) => width ?? '32px'};
  height: ${({ height }) => height ?? '32px'};
  position: ${({ position }) => position ?? 'static'};
  padding: ${({ padding }) => padding ?? '0'};
  top: 0;
  left: 0;
  border-radius: 50%;
  margin: ${({ margin }) => margin ?? '0'};
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
  padding: ${({ padding }) => padding ?? '0'};
  top: 0;
  left: 0;
`;

export function NetworkLogo({
  src,
  width,
  height,
  position,
  padding,
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
        <GlobeIconContainer
          width={width}
          height={height}
          position={position}
          padding={padding}
          margin={margin}
        >
          <GlobeIcon size={16} />
        </GlobeIconContainer>
      )}
    </>
  );
}
