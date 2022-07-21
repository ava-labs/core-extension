import { VerticalFlex } from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { CircularText } from '../common/CircularText';

export function EthereumQRCodeLogo({
  text,
  size = 91,
  position = 'relative',
  className,
}: {
  text: string;
  size: number;
  position?: string;
  className?: string;
}) {
  const theme = useTheme();
  return (
    <VerticalFlex
      className={className}
      position={position}
      radius="50%"
      background={theme.colors.icon1}
      width={`${size}px`}
      height={`${size}px`}
      padding="4px"
      align="center"
      justify="center"
    >
      <svg
        style={{ position: 'absolute' }}
        width={Math.floor(size * 0.6)}
        height={Math.floor(size * 0.6)}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 40C31.0457 40 40 31.0457 40 20C40 8.95432 31.0457 0 20 0C8.95432 0 0 8.95432 0 20C0 31.0457 8.95432 40 20 40Z"
          fill={theme.colors.bg1}
        />
        <path
          d="M20.2216 4.20312L10.3828 20.53L20.2216 16.0582V4.20312Z"
          fill="white"
        />
        <path
          d="M20.2216 16.0586L10.3828 20.5304L20.2216 26.3477V16.0586Z"
          fill="white"
        />
        <path
          d="M30.0672 20.53L20.2266 4.20312V16.0582L30.0672 20.53Z"
          fill="white"
        />
        <path
          d="M20.2266 26.3477L30.0672 20.5304L20.2266 16.0586V26.3477Z"
          fill="white"
        />
        <path
          d="M10.3828 22.4023L20.2216 36.2682V28.2159L10.3828 22.4023Z"
          fill="white"
        />
        <path
          d="M20.2266 28.2159V36.2682L30.0726 22.4023L20.2266 28.2159Z"
          fill="white"
        />
      </svg>

      <CircularText text={text} />
    </VerticalFlex>
  );
}
