import { useCallback } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { useAccountsContext, useNetworkContext } from '@core/ui';
import { AddressType, getUniqueTokenId } from '@core/types';

import {
  getSendPath,
  SEND_QUERY_TOKENS,
  SendQueryTokens,
} from '@/config/routes';
import { Card } from '@/components/Card';
import { Page } from '@/components/Page';
import { AccountSelect } from '@/components/AccountSelect';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { useTokensForAccount } from '@/components/TokenSelect';
import { RecipientSelect, useRecipients } from '@/components/RecipientSelect';

import { SendBody } from './components/SendBody';
import { getAddressTypeForToken } from './lib/getAddressTypeForToken';

export const Send = () => {
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
  const recipientAddressType: AddressType = selectedToken
    ? getAddressTypeForToken(selectedToken)
    : 'C';

  const recipients = useRecipients(recipientAddressType, recipientQuery);
  const recipient = recipients.find((r) => r.id === recipientId);

  return (
    <Page
      title={t('Send')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Stack width="100%" gap={2} flexGrow={1}>
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
          addressType={recipientAddressType}
          value={recipient}
          onQueryChange={(q) => updateQueryParam(searchParams, { toQuery: q })}
          onValueChange={(r) =>
            updateQueryParam(searchParams, { toQuery: '', to: r.id })
          }
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
