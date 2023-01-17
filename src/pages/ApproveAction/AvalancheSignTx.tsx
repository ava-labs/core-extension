import {
  ComponentSize,
  HorizontalFlex,
  PrimaryButton,
  SecondaryButton,
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
import { AvalancheSignTxDetails } from '@src/pages/ApproveAction/AvalancheSignTxDetails';

export function AvalancheSignTx() {
  const requestId = useGetRequestId();
  const theme = useTheme();
  const { action, updateAction } = useApproveAction(requestId);

  const signTx = useCallback(() => {
    updateAction({
      status: ActionStatus.SUBMITTING,
      id: requestId,
      result: '',
    });
    window.close();
  }, [requestId, updateAction]);

  if (!action) {
    return <LoadingOverlay />;
  }

  return (
    <VerticalFlex>
      <VerticalFlex align="center" justify="center">
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
          Sign Transaction
        </Typography>
      </VerticalFlex>
      <VerticalFlex grow="1" width="100%" align="center">
        <VerticalFlex grow="1" width="100%">
          <AvalancheSignTxDetails
            tx={action.displayData.txData}
          ></AvalancheSignTxDetails>
        </VerticalFlex>

        <HorizontalFlex
          flex={1}
          align="flex-end"
          width="100%"
          justify="space-between"
          padding="0 0 8px"
        >
          <SecondaryButton
            size={ComponentSize.LARGE}
            width="168px"
            onClick={() => {
              updateAction({
                status: ActionStatus.ERROR_USER_CANCELED,
                id: action.id,
              });
              window.close();
            }}
          >
            Reject
          </SecondaryButton>
          <PrimaryButton
            width="168px"
            size={ComponentSize.LARGE}
            onClick={() => {
              signTx();
            }}
          >
            Approve
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
