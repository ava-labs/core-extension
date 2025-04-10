import { useCallback, useEffect, useState } from 'react';
import { EnterPassword } from './EnterPassword';
import { ShowPrivateKey } from './ShowPrivateKey';
import { Stack, useTheme } from '@avalabs/core-k2-components';
import { GetPrivateKeyHandler } from 'packages/service-worker/src/services/accounts/handlers/getPrivateKey';
import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useLocation } from 'react-router-dom';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import {
  AccountType,
  GetPrivateKeyErrorTypes,
  PrivateKeyChain,
} from 'packages/service-worker/src/services/accounts/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTranslation } from 'react-i18next';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SecretType } from 'packages/service-worker/src/services/secrets/models';

export function ExportPrivateKey() {
  const theme = useTheme();
  const { request } = useConnectionContext();
  const { search } = useLocation();
  const { accounts } = useAccountsContext();
  const { wallets } = useWalletContext();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const [type, setType] = useState<
    SecretType.Mnemonic | AccountType.IMPORTED | null
  >(null);
  const [index, setIndex] = useState(0);
  const [id, setId] = useState('');

  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    (password: string, chain: PrivateKeyChain) => {
      if (!type) {
        capture('ExportPrivateKeyErrorInvalidType');
        throw new Error('Invalid type!');
      }
      setIsLoading(true);
      request<GetPrivateKeyHandler>({
        method: ExtensionRequest.ACCOUNT_GET_PRIVATEKEY,
        params: [{ type, index, id, password, chain }],
      })
        .then((res) => {
          setPrivateKey(res);
          capture('ExportPrivateKeySuccessful', { chain });
        })
        .catch((e: { type: GetPrivateKeyErrorTypes; message: string }) => {
          if (e.type === GetPrivateKeyErrorTypes.Password) {
            setError(t('Invalid Password'));
            capture('ExportPrivateKeyErrorInvalidPassword');
            return;
          } else if (e.type === GetPrivateKeyErrorTypes.Chain) {
            setError(t('Invalid Chain'));
            capture('ExportPrivateKeyErrorInvalidChain');
            return;
          }
          setError(t('Something bad happened please try again later!'));
          capture('ExportPrivateKeyFailed');
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [capture, id, index, request, t, type],
  );

  useEffect(() => {
    const url = new URLSearchParams(search);
    const accountId = url.get('accountId');

    setId(accountId || '');

    const isImported = !!(accountId && accounts.imported[accountId]) || false;

    if (isImported) {
      setType(AccountType.IMPORTED);
      return;
    }

    const account = Object.values(accounts.primary)
      .flat()
      .find((primaryAccount) => {
        return primaryAccount.id === accountId;
      });

    if (!account) {
      return;
    }

    const wallet = wallets.find((w) => w.id === account.walletId);
    if (wallet?.type === SecretType.Mnemonic) {
      setIndex(account.index);
      setType(SecretType.Mnemonic);
    }
  }, [accounts, index, search, wallets]);

  return (
    <>
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          background: theme.palette.background.paper,
          justifyContent: 'space-between',
        }}
      >
        {!privateKey && (
          <>
            <EnterPassword
              accountType={type}
              errorMessage={error}
              isLoading={isLoading}
              onSubmit={onSubmit}
            />
          </>
        )}
        {privateKey && <ShowPrivateKey privateKey={privateKey} />}
      </Stack>
    </>
  );
}
