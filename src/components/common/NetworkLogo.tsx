import {
  CheckIcon,
  GlobeIcon,
  Stack,
  styled,
} from '@avalabs/core-k2-components';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';

export const GlobeIconContainer = styled('div')<NetworkLogoProps>`
  width: ${({ width }) => width ?? '32px'};
  height: ${({ height }) => height ?? '32px'};
  position: ${({ position }) => position ?? 'static'};
  top: 0;
  left: 0;
  border-radius: 50%;
  margin: ${({ margin }) => margin ?? '0'};
  z-index: ${({ zIndex }) => zIndex ?? '0'};
  background: ${({ withBackground, theme }) =>
    withBackground ? theme.palette.background.default : 'none'};
  border: ${({ withBackground, showGlobeMargin }) =>
    withBackground && showGlobeMargin ? '4px solid' : 'none'};
  border-color: ${({ withBackground, theme }) =>
    withBackground ? theme.palette.background.default : 'none'};
  border-radius: ${({ withBackground }) => (withBackground ? '50%' : 'none')};
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
  defaultSize?: number;
  showComplete?: boolean;
  showGlobeMargin?: boolean;
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

const CheckContainer = styled(Stack)`
  position: absolute;
  background: ${({ theme }) => theme.palette.success.main};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  z-index: 5;
  border: ${({ theme }) => `4px solid ${theme.palette.background.default}`};
`;

export function NetworkLogo({
  src,
  width,
  height,
  position,
  margin,
  zIndex,
  withBackground = false,
  defaultSize,
  showComplete = false,
  showGlobeMargin,
}: NetworkLogoProps) {
  return (
    <Stack sx={{ position: 'relative' }}>
      {showComplete && (
        <CheckContainer>
          <CheckIcon size={10} />
        </CheckContainer>
      )}
      {src ? (
        <NetworkLogoImage
          height={height}
          width={width}
          src={ipfsResolverWithFallback(src)}
          position={position}
          margin={margin}
          zIndex={zIndex}
          withBackground={withBackground}
        />
      ) : (
        <GlobeIconContainer
          width={width}
          height={height}
          position={position}
          margin={margin}
          zIndex={zIndex}
          withBackground={withBackground}
          showGlobeMargin={showGlobeMargin}
        >
          <GlobeIcon
            size={defaultSize}
            sx={{ m: 'auto', display: 'block', position: 'absolute' }}
          />
        </GlobeIconContainer>
      )}
    </Stack>
  );
}
