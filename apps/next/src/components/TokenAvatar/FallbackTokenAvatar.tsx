import { FC } from 'react';
import { useTheme } from '@avalabs/k2-alpine';
import { GenericTokenDark } from './GenericTokenDark';
import { GenericTokenLight } from './GenericTokenLight';

type FallbackTokenAvatarProps = {
  symbol: string;
};

export const FallbackTokenAvatar: FC<FallbackTokenAvatarProps> = ({
  symbol,
}) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === 'light';
  const FallbackSVG = isLightMode ? GenericTokenLight : GenericTokenDark;
  return <FallbackSVG alt={symbol} style={{ width: '100%', height: '100%' }} />;
};
