import { useCallback } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { useAccountsContext } from '@core/ui';

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

export const Send = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const { replace } = useHistory();

  const {
    selectAccount,
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const searchParams = new URLSearchParams(search);
  const fromQuery = searchParams.get(SEND_QUERY_TOKENS.fromQuery) ?? '';
  const tokenId = searchParams.get(SEND_QUERY_TOKENS.token) ?? '';
  const tokenQuery = searchParams.get(SEND_QUERY_TOKENS.tokenQuery) ?? '';
  const amount = searchParams.get(SEND_QUERY_TOKENS.amount) ?? '';

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
            tokensForAccount={tokensForAccount}
            onTokenChange={(value) => {
              updateQueryParam(searchParams, { token: value });
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
      </Stack>
    </Page>
  );
};
