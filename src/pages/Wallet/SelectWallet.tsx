import {
  Typography,
  VerticalFlex,
  WalletIcon,
} from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SelectWalletExtensionForDappHandler } from '@src/background/services/actions/handlers/selectWallet';
import { WalletExtensionType } from '@src/background/services/web3/models';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';
import { useCallback, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { WalletExtensionButton } from './components/WalletExtensionButton';

export function SelectWallet() {
  const theme = useTheme();
  const { request } = useConnectionContext();
  const { options, requestId, domain, tabId } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    return {
      options: params.getAll('options') as WalletExtensionType[] | null,
      requestId: params.get('id'),
      domain: params.get('domain'),
      tabId: params.get('tabId'),
    };
  }, []);

  const selectWallet = useCallback(
    (index: number) => {
      if (!requestId || !domain || !tabId) {
        return;
      }

      request<SelectWalletExtensionForDappHandler>({
        method: ExtensionRequest.WALLET_SELECT_WALLET_FOR_DAPP,
        params: [requestId, domain, Number(tabId), index],
      });

      window.close();
    },
    [domain, request, requestId, tabId]
  );

  const cancelHandler = useCallback(() => {
    selectWallet(-1);
  }, [selectWallet]);

  useWindowGetsClosedOrHidden(cancelHandler);

  if (!options || !options.length || !requestId) {
    return <LoadingOverlay />;
  }
  return (
    <VerticalFlex>
      <VerticalFlex grow="1" align="center" justify="center">
        <SiteAvatar justify="center" align="center">
          <WalletIcon height="48px" width="48px" color={theme.colors.icon1} />
        </SiteAvatar>
        <Typography
          align="center"
          size={24}
          margin="16px 0"
          height="29px"
          weight={700}
        >
          Which wallet would <br />
          you like to use?
        </Typography>
        <Typography align="center" size={14} height="17px">
          It looks like multiple wallets are installed. <br />
          Select which one you would like to connect.
        </Typography>
      </VerticalFlex>
      <VerticalFlex width="100%" align="center">
        {options.map((option, i) => (
          <WalletExtensionButton
            key={i}
            onClick={() => {
              selectWallet(i);
            }}
            type={option}
          />
        ))}
      </VerticalFlex>
    </VerticalFlex>
  );
}
