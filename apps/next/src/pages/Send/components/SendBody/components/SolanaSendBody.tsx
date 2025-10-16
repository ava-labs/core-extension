import { useTranslation } from 'react-i18next';
import { Button, Fade, Stack, Typography } from '@avalabs/k2-alpine';

import { stringToBigint } from '@core/common';
import {
  NetworkWithCaipId,
  SvmCapableAccount,
  SolanaNativeTokenBalance,
  SolanaSplTokenBalance,
} from '@core/types';

import {
  type Recipient,
  getRecipientAddressByType,
} from '@/components/RecipientSelect';

import { useSolanaSend } from '../hooks/useSolanaSend';

type SolanaSendBodyProps = {
  from: SvmCapableAccount;
  token: SolanaNativeTokenBalance | SolanaSplTokenBalance;
  network: NetworkWithCaipId;
  amount: string;
  recipient: Recipient;
};

export const SolanaSendBody = ({
  from,
  token,
  amount,
  recipient,
  network,
}: SolanaSendBodyProps) => {
  const { t } = useTranslation();

  const to = getRecipientAddressByType(recipient, 'SVM');
  const amountBigInt = stringToBigint(amount || '0', token.decimals);

  const { isSending, isValid, error, send } = useSolanaSend({
    token,
    amount: amountBigInt,
    from,
    to,
    network,
  });

  // TODO: analytics

  return (
    <Stack width="100%" flexGrow={1} justifyContent="space-between">
      <Fade in={Boolean(error)}>
        <Stack width="100%" textAlign="center">
          <Typography variant="caption" color="error.main">
            {error}
          </Typography>
        </Stack>
      </Fade>
      <Stack width="100%">
        <Button
          variant="contained"
          color="primary"
          size="extension"
          fullWidth
          disabled={!isValid}
          loading={isSending}
          onClick={send}
        >
          {t('Send')}
        </Button>
      </Stack>
    </Stack>
  );
};
