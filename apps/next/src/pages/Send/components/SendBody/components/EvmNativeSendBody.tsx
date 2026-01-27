import { Fade, Stack, Typography } from '@avalabs/k2-alpine';

import { stringToBigint } from '@core/common';
import { Account, FungibleTokenBalance, NetworkWithCaipId } from '@core/types';

import {
  type Recipient,
  getRecipientAddressByType,
} from '@/components/RecipientSelect';

import { useEvmNativeSend } from '../hooks/useEvmNativeSend';
import { TxButton } from '@/components/TxButton';
import { useTranslation } from 'react-i18next';

type EvmNativeSendBodyProps = {
  from: Account;
  token: FungibleTokenBalance;
  network: NetworkWithCaipId;
  amount: string;
  recipient: Recipient;
};

export const EvmNativeSendBody = ({
  from,
  token,
  amount,
  recipient,
  network,
}: EvmNativeSendBodyProps) => {
  const to = getRecipientAddressByType(recipient, 'C');
  const amountBigInt = stringToBigint(amount || '0', token.decimals);
  const { t } = useTranslation();
  const { isSending, isValid, error, send } = useEvmNativeSend({
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
