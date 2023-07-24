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
  z-index: ${({ zIndex }) => zIndex ?? '0'};
`;

interface NetworkLogoProps {
  src?: string;
  width?: string;
  height?: string;
  position?: string;
  padding?: string;
  margin?: string;
  zIndex?: number;
  withBackground?: boolean;
}

const NetworkLogoImage = styled('img')<NetworkLogoProps>`
  width: ${({ width }) => width ?? 'auto'};
  height: ${({ height }) => height ?? '32px'};
  position: ${({ position }) => position ?? 'static'};
  margin: ${({ margin }) => margin ?? '0'};
  padding: ${({ padding }) => padding ?? '0'};
  z-index: ${({ zIndex }) => zIndex ?? '0'};
  top: 0;
  left: 0;
  background: ${({ withBackground, theme }) =>
    withBackground ? theme.palette.background.default : 'none'};

  border: ${({ withBackground }) => (withBackground ? '8px solid' : 'none')};
  border-color: ${({ withBackground, theme }) =>
    withBackground ? theme.palette.background.default : 'none'};
  border-radius: ${({ withBackground }) => (withBackground ? '50%' : 'none')};
`;

export function NetworkLogo({
  src,
  width,
  height,
  position,
  padding,
  margin,
  zIndex,
  withBackground = false,
}: NetworkLogoProps) {
  return (
    <>
      {src ? (
        <NetworkLogoImage
          height={height}
          width={width}
          src={ipfsResolverWithFallback(src)}
          position={position}
          margin={margin}
          zIndex={zIndex}
          withBackground={withBackground}
        ></NetworkLogoImage>
      ) : (
        <GlobeIconContainer
          width={width}
          height={height}
          position={position}
          padding={padding}
          margin={margin}
          zIndex={zIndex}
          withBackground={withBackground}
        >
          <GlobeIcon size={16} sx={{ m: 'auto', display: 'block' }} />
        </GlobeIconContainer>
      )}
    </>
  );
}
