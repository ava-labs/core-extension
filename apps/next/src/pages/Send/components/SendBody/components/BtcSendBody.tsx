import { useTranslation } from 'react-i18next';
import { Button, Fade, Stack, Typography } from '@avalabs/k2-alpine';

import { stringToBigint } from '@core/common';
import {
  BtcCapableAccount,
  BtcTokenBalance,
  NetworkWithCaipId,
} from '@core/types';

import {
  type Recipient,
  getRecipientAddressByType,
} from '@/components/RecipientSelect';

import { useBtcSend } from '../hooks/useBtcSend';

type BtcSendBodyProps = {
  from: BtcCapableAccount;
  token: BtcTokenBalance;
  network: NetworkWithCaipId;
  amount: string;
  recipient: Recipient;
};

export const BtcSendBody = ({
  from,
  token,
  amount,
  recipient,
  network,
}: BtcSendBodyProps) => {
  const { t } = useTranslation();

  const to = getRecipientAddressByType(recipient, 'BTC');
  const amountBigInt = stringToBigint(amount || '0', token.decimals);

  const { isSending, isValid, error, send } = useBtcSend({
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
