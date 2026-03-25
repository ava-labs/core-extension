import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@avalabs/k2-alpine';

type Props = {
  sum: string;
  symbol: string;
  isNativeToken: boolean;
};

export const AdditiveFeesNotice: FC<Props> = ({
  sum,
  symbol,
  isNativeToken,
}) => {
  const { t } = useTranslation();

  return (
    <Typography
      component="p"
      color="text.secondary"
      textAlign="center"
      variant="caption"
      minHeight="1lh"
    >
      {sum &&
        symbol &&
        t(
          isNativeToken
            ? '+{{sum}} {{symbol}} for network and bridge fees'
            : '+{{sum}} {{symbol}} for bridge fees',
          {
            sum,
            symbol,
          },
        )}
    </Typography>
  );
};
