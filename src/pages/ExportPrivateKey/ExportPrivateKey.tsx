import { useCallback, useEffect, useState } from 'react';
import { EnterPassword } from './EnterPassword';
import { ShowPrivateKey } from './ShowPrivateKey';
import { Stack, useTheme } from '@avalabs/k2-components';
import { GetPrivateKeyHandler } from '@src/background/services/accounts/handlers/getPrivateKey';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useLocation } from 'react-router-dom';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import {
  AccountType,
  GetPrivateKeyErrorTypes,
} from '@src/background/services/accounts/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { WalletType } from '@src/background/services/wallet/models';
import { useTranslation } from 'react-i18next';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function ExportPrivateKey() {
  const theme = useTheme();
  const { request } = useConnectionContext();
  const { search } = useLocation();
  const { accounts } = useAccountsContext();
  const { walletDetails } = useWalletContext();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const [type, setType] = useState<
    WalletType.MNEMONIC | AccountType.IMPORTED | null
  >();
  const [index, setIndex] = useState(0);
  const [id, setId] = useState('');

  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(() => {
    if (!type) {
      capture('ExportPrivateKeyErrorInvalidType');
      throw new Error('Invalid type!');
    }
    setIsLoading(true);
    request<GetPrivateKeyHandler>({
      method: ExtensionRequest.ACCOUNT_GET_PRIVATEKEY,
      params: [{ type, index, id, password }],
    })
      .then((res) => {
        setPrivateKey(res);
        capture('ExportPrivateKeySuccessful');
      })
      .catch((e: { type: GetPrivateKeyErrorTypes; message: string }) => {
        if (e.type === GetPrivateKeyErrorTypes.Password) {
          setError(t('Invalid Password'));
          capture('ExportPrivateKeyErrorInvalidPassword');
          return;
        }
        setError(t('Something bad happened please try again later!'));
        capture('ExportPrivateKeyFailed');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [capture, id, index, password, request, t, type]);

  useEffect(() => {
    const url = new URLSearchParams(search);
    const accountId = url.get('accountId');

    setId(accountId || '');

    const isImported = !!(accountId && accounts.imported[accountId]) || false;

    const isMnemonic = walletDetails?.type === WalletType.MNEMONIC;
    if (isImported) {
      setType(AccountType.IMPORTED);
    }
    if (!isImported && isMnemonic) {
      setType(WalletType.MNEMONIC);
      const account = Object.values(accounts.primary)
        .flat()
        .find((primaryAccount) => {
          return primaryAccount.id === accountId;
        });
      account && setIndex(account?.index);
    }
  }, [accounts, index, search, walletDetails, walletDetails?.type]);

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
          <EnterPassword
            errorMessage={error}
            setPassword={setPassword}
            isLoading={isLoading}
            onSubmit={onSubmit}
            password={password}
          />
        )}
        {privateKey && <ShowPrivateKey privateKey={privateKey} />}
      </Stack>
    </>
  );
}
