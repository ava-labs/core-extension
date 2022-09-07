import {
  Typography,
  VerticalFlex,
  WalletIcon,
} from '@avalabs/react-components';
import { ActionStatus } from '@src/background/services/actions/models';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useCallback } from 'react';
import { useTheme } from 'styled-components';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { WalletExtensionButton } from '../Wallet/components/WalletExtensionButton';

export function SelectWallet() {
  const requestId = useGetRequestId();
  const theme = useTheme();
  const { action: request, updateAction } = useApproveAction(requestId);

  const selectWallet = useCallback(
    (index: number) => {
      updateAction({
        status: ActionStatus.SUBMITTING,
        id: requestId,
        result: index,
      });

      window.close();
    },
    [requestId, updateAction]
  );

  if (!request) {
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
        {request.displayData.options.map((option, i) => (
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
