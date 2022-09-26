import { GlobeIcon } from '@avalabs/react-components';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';
import styled, { useTheme } from 'styled-components';

export const GlobeIconContainer = styled.div<NetworkLogoProps>`
  width: ${({ width }) => width ?? '32px'};
  height: ${({ height }) => height ?? '32px'};
  position: ${({ position }) => position ?? 'static'};
  padding: ${({ padding }) => padding ?? '0'};
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.stroke1};
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

const NetworkLogoImage = styled.img<NetworkLogoProps>`
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
  const theme = useTheme();
  return (
    <>
      {src ? (
        <NetworkLogoImage
          height={height}
          src={ipfsResolverWithFallback(src)}
          position={position}
        ></NetworkLogoImage>
      ) : (
        <GlobeIconContainer
          width={width}
          height={height}
          position={position}
          padding={padding}
          margin={margin}
        >
          <GlobeIcon width="100%" height="100%" color={theme.colors.text1} />
        </GlobeIconContainer>
      )}
    </>
  );
}
