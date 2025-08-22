import {
  Account,
  FungibleTokenBalance,
  isEvmNativeToken,
  NetworkWithCaipId,
} from '@core/types';
import { isNil } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Recipient } from '@/components/RecipientSelect';

import { DisabledSendBody, EvmNativeSendBody } from './components';

type SendBodyProps = Partial<{
  account: Account;
  network: NetworkWithCaipId;
  token: FungibleTokenBalance;
  amount: string;
  recipient: Recipient;
}>;

export const SendBody = ({
  account,
  network,
  token,
  amount,
  recipient,
}: SendBodyProps) => {
  const { t } = useTranslation();

  // If any of the parameters is not ready, we just show a disabled Send button.
  if (
    isNil(token) ||
    isNil(network) ||
    isNil(account) ||
    isNil(recipient) ||
    !amount
  ) {
    return (
      <DisabledSendBody
        reason={t('Please provide all the required information to send.')}
      />
    );
  }

  if (isEvmNativeToken(token)) {
    return (
      <EvmNativeSendBody
        from={account.addressC}
        token={token}
        recipient={recipient}
        amount={amount}
        network={network}
      />
    );
  }

  return (
    <DisabledSendBody reason={t('Sending this token is not supported yet.')} />
  );
};
