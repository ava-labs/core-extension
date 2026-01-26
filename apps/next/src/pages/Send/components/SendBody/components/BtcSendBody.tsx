import { Fade, Stack, Typography } from '@avalabs/k2-alpine';

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
import { TxButton } from '@/components/TxButton';
import { useTranslation } from 'react-i18next';

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
  const to = getRecipientAddressByType(recipient, 'BTC');
  const amountBigInt = stringToBigint(amount || '0', token.decimals);
  const { t } = useTranslation();

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
        <TxButton
          isLoading={isSending}
          onClick={send}
          title={t('Send')}
          isDisabled={!isValid}
        />
      </Stack>
    </Stack>
  );
};
