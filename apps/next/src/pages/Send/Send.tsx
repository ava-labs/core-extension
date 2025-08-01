import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce, Stack } from '@avalabs/k2-alpine';

import {
  useAccountsContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';

import { Page } from '@/components/Page';
import { useHistory, useLocation } from 'react-router-dom';
import {
  getSendPath,
  SEND_QUERY_TOKENS,
  SendQueryTokens,
} from '@/config/routes';
import { FromAddressField } from './components/AddressField/FromAddressField/FromAddressField';
import { TokenField } from './components/TokenField';

export const Send = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const { push, replace } = useHistory();

  const {
    accounts: { active },
  } = useAccountsContext();

  const searchParams = new URLSearchParams(search);
  const from = searchParams.get(SEND_QUERY_TOKENS.from) ?? active?.id;
  const fromQuery = searchParams.get(SEND_QUERY_TOKENS.fromQuery) ?? '';
  const to = searchParams.get(SEND_QUERY_TOKENS.to) ?? '';
  const toQuery = searchParams.get(SEND_QUERY_TOKENS.toQuery) ?? '';
  const amount = searchParams.get(SEND_QUERY_TOKENS.amount) ?? '';
  const token = searchParams.get(SEND_QUERY_TOKENS.token) ?? '';

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
        <FromAddressField
          addressType="C" // TODO: fixed to EVM for now
          value={from ?? ''}
          query={fromQuery}
          onValueChange={(value) =>
            updateQueryParam(searchParams, 'from', value)
          }
          onQueryChange={(value) =>
            updateQueryParam(searchParams, 'fromQuery', value)
          }
        />
        <TokenField
          value={token}
          accountId={from}
          onChange={(tokenIdentifier) =>
            updateQueryParam(searchParams, 'token', tokenIdentifier)
          }
        />
      </Stack>
    </Page>
  );
};
