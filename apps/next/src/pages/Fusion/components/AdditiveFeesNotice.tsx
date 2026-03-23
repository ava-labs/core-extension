import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, useTheme } from '@avalabs/k2-alpine';

type Props = {
  sum: string;
  symbol: string;
};

export const AdditiveFeesNotice: FC<Props> = ({ sum, symbol }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Typography
      component="p"
      color="text.secondary"
      textAlign="center"
      variant="caption"
      minHeight={theme.typography.caption.lineHeight}
    >
      {sum &&
        symbol &&
        t('+{{sum}} {{symbol}} for network and bridge fees', {
          sum,
          symbol,
        })}
    </Typography>
  );
};
