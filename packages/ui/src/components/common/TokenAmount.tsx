import { Stack, Typography } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { TokenIcon } from '@/components/common/TokenIcon';
import { TokenWithBalance } from '@avalabs/vm-module-types';

type TokenAmountProps = {
  token: TokenWithBalance;
  amount: string;
  fiatValue?: string;
};

export const TokenAmount = ({ token, amount, fiatValue }: TokenAmountProps) => {
  const { t } = useTranslation();

  // FIXME: Our contract parsers are not guarded from returning NaN as USD values.
  // Until this is fixed, we'll prevent displaying NaNs here.
  const displayFiatValue =
    typeof fiatValue === 'string' && !fiatValue.includes('NaN');

  return (
    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <TokenIcon src={token?.logoUri} />
        <Typography variant="body1" sx={{ fontWeight: 'fontWeightSemibold' }}>
          {token?.symbol || t('Unknown')}
        </Typography>
      </Stack>
      <Stack
        sx={{
          textAlign: 'end',
          justifyContent: fiatValue ? 'space-between' : 'center',
        }}
      >
        <Typography variant="body2" component="span" sx={{ lineHeight: 1 }}>
          {amount} {token?.symbol || t('Unknown Symbol')}
        </Typography>
        {displayFiatValue && (
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', lineHeight: 1 }}
          >
            {fiatValue}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
