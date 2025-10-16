import { Stack } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { getUniqueTokenId } from '@core/types';
import {
  useAccountsContext,
  useLiveBalance,
  useNetworkContext,
} from '@core/ui';

import { AccountSelect } from '@/components/AccountSelect';
import { Card } from '@/components/Card';
import { Page } from '@/components/Page';
import {
  getRecipientAddressByType,
  RecipientSelect,
  useRecipients,
} from '@/components/RecipientSelect';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import {
  getSendPath,
  SEND_QUERY_TOKENS,
  SendQueryTokens,
} from '@/config/routes';
import { useMaxAmountForTokenSend } from '@/hooks/useMaxAmountForTokenSend';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { getAddressByType } from '@/utils/getAddressByType';

import { SendBody } from './components/SendBody';
import { getAddressTypeForToken } from './lib/getAddressTypeForToken';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export const Send = () => {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();
  const { search } = useLocation();
  const { replace } = useHistory();
  const { getNetwork } = useNetworkContext();

  const {
    selectAccount,
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const searchParams = new URLSearchParams(search);
  const fromQuery = searchParams.get(SEND_QUERY_TOKENS.fromQuery) ?? '';
  const tokenId = searchParams.get(SEND_QUERY_TOKENS.token) ?? '';
  const tokenQuery = searchParams.get(SEND_QUERY_TOKENS.tokenQuery) ?? '';
  const amount = searchParams.get(SEND_QUERY_TOKENS.amount) ?? '';
  const recipientId = searchParams.get(SEND_QUERY_TOKENS.to) ?? '';
  const recipientQuery = searchParams.get(SEND_QUERY_TOKENS.toQuery) ?? '';

  const updateQueryParam = useCallback(
    (
      current: URLSearchParams,
      payload: Partial<Record<keyof SendQueryTokens, string>>,
    ) => {
      const updated = new URLSearchParams(current);

      for (const [k, v] of Object.entries(payload)) {
        updated.set(SEND_QUERY_TOKENS[k], v);
      }

      replace({
        pathname: getSendPath(),
        search: updated.toString(),
      });
    },
    [replace],
  );

  const tokensForAccount = useTokensForAccount(activeAccount);

  // Allows us to show only those recipients that are compatible with the selected token
  const selectedToken = tokensForAccount.find(
    (tok) => getUniqueTokenId(tok) === tokenId,
  );

  const addressType = selectedToken
    ? getAddressTypeForToken(selectedToken)
    : 'C';

  const sourceAddress = activeAccount
    ? (getAddressByType(activeAccount, addressType) ?? '')
    : '';

  const recipients = useRecipients(addressType, recipientQuery);
  const recipient = recipients.find((r) => r.id === recipientId);

  const { maxAmount, estimatedFee } = useMaxAmountForTokenSend(
    activeAccount,
    selectedToken,
    recipient
      ? getRecipientAddressByType(recipient, addressType)
      : // With BTC, we have a chicken-egg problem, where we need to know the recipient address to get the max amount.
        // This helps us to at least roughly estimate the max amount before the recipient is selected.
        sourceAddress,
  );

  return (
    <Page
      title={t('Send')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Stack width="100%" gap={2}>
        <AccountSelect
          addressType="C"
          value={activeAccount}
          query={fromQuery}
          onValueChange={(newAccount) => {
            selectAccount(newAccount.id);
            // Clear the query after selecting account
            updateQueryParam(searchParams, { fromQuery: '' });
          }}
          onQueryChange={(q) =>
            updateQueryParam(searchParams, { fromQuery: q })
          }
        />
        <Card>
          <TokenAmountInput
            id="send-token-amount"
            tokenId={tokenId}
            maxAmount={maxAmount}
            estimatedFee={estimatedFee}
            tokensForAccount={tokensForAccount}
            onTokenChange={(value) => {
              updateQueryParam(searchParams, {
                token: value,
                tokenQuery: '',
              });
            }}
            tokenQuery={tokenQuery}
            onQueryChange={(q) =>
              updateQueryParam(searchParams, { tokenQuery: q })
            }
            amount={amount}
            onAmountChange={(value) =>
              updateQueryParam(searchParams, {
                amount: value,
              })
            }
          />
        </Card>
        <RecipientSelect
          addressType={addressType}
          value={recipient}
          onQueryChange={(q) => updateQueryParam(searchParams, { toQuery: q })}
          onValueChange={(r) => {
            updateQueryParam(searchParams, {
              // Do not clear the query if user manually provided the recipient's address.
              toQuery: r.type === 'unknown' ? recipientQuery : '',
              to: r.id,
            });
          }}
          recipients={recipients}
          query={recipientQuery}
        />
      </Stack>

      <SendBody
        account={activeAccount}
        network={
          selectedToken ? getNetwork(selectedToken.coreChainId) : undefined
        }
        token={selectedToken}
        amount={amount}
        recipient={recipient}
      />
    </Page>
  );
};
