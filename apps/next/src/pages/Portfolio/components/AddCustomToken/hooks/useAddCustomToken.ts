import { caipToChainId } from '@core/common';
import { ExtensionRequest, NetworkWithCaipId } from '@core/types';
import {
  useAccountsContext,
  useAnalyticsContext,
  useBalancesContext,
  useConnectionContext,
} from '@core/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AddCustomTokenHandler } from '~/services/settings/handlers/addCustomToken';

export function useAddCustomToken() {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { request } = useConnectionContext();
  const { updateBalanceOnNetworks } = useBalancesContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const addCustomToken = useCallback(
    async (tokenAddress: string, network: NetworkWithCaipId['caipId']) => {
      if (!tokenAddress) {
        return;
      }

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
        if (!success) {
          throw new Error('Adding the token failed.');
        }
        capture('ManageTokensAddCustomToken', {
          status: 'success',
          address: tokenAddress,
        });

        // Fetch the new token's balance from the RPC right away so it shows up in the UI
        if (activeAccount) {
          updateBalanceOnNetworks(
            [activeAccount],
            [caipToChainId(network)],
          ).catch(() => undefined);
        }
      } catch (_err: unknown) {
        capture('ManageTokensAddCustomToken', {
          status: 'failed',
          address: tokenAddress,
        });
        if (typeof _err === 'string' && _err.includes('already exists')) {
          throw new Error(t('Token already exists in the wallet.'));
        }
        throw _err;
      }
    },
    [request, t, capture, updateBalanceOnNetworks, activeAccount],
  );

  return {
    addCustomToken,
  };
}
