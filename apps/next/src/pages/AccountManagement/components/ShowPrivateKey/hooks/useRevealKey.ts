import {
  AccountType,
  ExtensionRequest,
  GetPrivateKeyErrorTypes,
  PrivateKeyChain,
  SecretType,
} from '@core/types';
import { useAnalyticsContext, useConnectionContext } from '@core/ui';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetPrivateKeyHandler } from '~/services/accounts/handlers/getPrivateKey';

export const useRevealKey = () => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { capture } = useAnalyticsContext();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const revealKey = useCallback(
    async (
      password: string,
      chain: PrivateKeyChain,
      type: SecretType.Mnemonic | AccountType.IMPORTED,
      index: number,
      id: string,
    ): Promise<string | null> => {
      if (!type) {
        capture('ExportPrivateKeyErrorInvalidType');
        throw new Error('Invalid type!');
      }
      setIsLoading(true);
      return request<GetPrivateKeyHandler>({
        method: ExtensionRequest.ACCOUNT_GET_PRIVATEKEY,
        params: [{ type, index, id, password, chain }],
      })
        .catch((e: { type: GetPrivateKeyErrorTypes; message: string }) => {
          if (e.type === GetPrivateKeyErrorTypes.Password) {
            setError(t('Invalid Password'));
          } else if (e.type === GetPrivateKeyErrorTypes.Chain) {
            setError(t('Invalid Chain'));
          } else {
            setError(t('Something bad happened please try again later!'));
          }

          return null;
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [capture, request, t],
  );

  return { error, isLoading, revealKey };
};
