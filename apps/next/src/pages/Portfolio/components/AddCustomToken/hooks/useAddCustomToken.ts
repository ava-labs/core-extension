import { toast } from '@avalabs/k2-alpine';
import { ExtensionRequest, NetworkWithCaipId } from '@core/types';
import { useAnalyticsContext, useConnectionContext } from '@core/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AddCustomTokenHandler } from '~/services/settings/handlers/addCustomToken';

export function useAddCustomToken() {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { request } = useConnectionContext();
  const { goBack } = useHistory();

  const addCustomToken = useCallback(
    async (tokenAddress: string, network: NetworkWithCaipId['caipId']) => {
      if (!tokenAddress) return;
      try {
        const success = await request<AddCustomTokenHandler>(
          {
            method: ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN,
            params: [tokenAddress],
          },
          {
            scope: network,
          },
        );
        if (success) {
          toast.success(t('Token Added'), { duration: 2000 });
        }
        capture('ManageTokensAddCustomToken', {
          status: 'success',
          address: tokenAddress,
        });
        goBack();
      } catch (_err: unknown) {
        capture('ManageTokensAddCustomToken', {
          status: 'failed',
          address: tokenAddress,
        });
        if (typeof _err === 'string' && _err.includes('already exists')) {
          toast.error(t('Token already exists in the wallet.'), {
            duration: 2000,
          });
          return;
        }
        toast.error(t('Adding the token failed.'), { duration: 2000 });
      }
    },
    [request, t, goBack, capture],
  );

  return {
    addCustomToken,
  };
}
