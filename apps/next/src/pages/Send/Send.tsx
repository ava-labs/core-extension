import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce, Stack } from '@avalabs/k2-alpine';
import { useHistory, useLocation } from 'react-router-dom';

import { useAccountsContext } from '@core/ui';

import {
  getSendPath,
  SEND_QUERY_TOKENS,
  SendQueryTokens,
} from '@/config/routes';
import { Page } from '@/components/Page';
import { AccountSelect } from '@/components/AccountSelect';

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

  const updateQueryParam = useMemo(
    () =>
      debounce(
        (
          current: URLSearchParams,
          key: keyof SendQueryTokens,
          value: string,
        ) => {
          const updated = new URLSearchParams(current);
          updated.set(SEND_QUERY_TOKENS[key], value);

          replace({
            pathname: getSendPath(),
            search: updated.toString(),
          });
        },
        50,
      ),
    [replace],
  );

  return (
    <Page
      title={t('Send')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Stack width="100%" gap={2}>
        <AccountSelect
          addressType="C" // TODO: fixed to EVM for now
          value={activeAccount}
          query={fromQuery}
          onValueChange={(newAccount) => selectAccount(newAccount.id)}
          onQueryChange={(value) =>
            updateQueryParam(searchParams, 'fromQuery', value)
          }
        />
      </Stack>
    </Page>
  );
};
