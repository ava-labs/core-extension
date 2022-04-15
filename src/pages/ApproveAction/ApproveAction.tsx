import {
  Card,
  ComponentSize,
  GlobeIcon,
  HorizontalFlex,
  LoadingSpinnerIcon,
  PrimaryButton,
  SecondaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ActionStatus } from '@src/background/services/actions/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useApproveAction } from '@src/hooks/useApproveAction';
import Scrollbars from 'react-custom-scrollbars-2';
import styled, { useTheme } from 'styled-components';
import { useGetRequestId } from '../../hooks/useGetRequestId';
import { SignTxRenderErrorBoundary } from '../SignTransaction/components/SignTxRenderErrorBoundary';
import { BridgeTransferAsset } from './BridgeTransferAsset';

const SiteAvatar = styled(VerticalFlex)`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: 8px 0;
`;

export function ApproveAction() {
  const theme = useTheme();
  const requestId = useGetRequestId();
  const { action, updateAction } = useApproveAction(requestId);

  if (!action) {
    return (
      <HorizontalFlex
        width={'100%'}
        height={'100%'}
        justify={'center'}
        align={'center'}
      >
        <LoadingSpinnerIcon color={theme.colors.icon1} />
      </HorizontalFlex>
    );
  }

  return (
    <>
      <VerticalFlex width="100%" padding="0 16px" align="center">
        <SignTxRenderErrorBoundary>
          <VerticalFlex padding="12px 0">
            <Typography as="h1" size={20} height="29px" weight={600}>
              {action.error ? 'Signing Failed' : 'Approve Action'}
            </Typography>
          </VerticalFlex>

          <VerticalFlex align="center" margin="0 0 24px">
            <SiteAvatar margin="8px 0" justify="center" align="center">
              <TokenIcon height="48px" width="48px" src={action.site?.icon}>
                <GlobeIcon
                  height="48px"
                  width="48px"
                  color={theme.colors.icon1}
                />
              </TokenIcon>
            </SiteAvatar>

            <Typography align="center" size={14} height="17px">
              {action.site?.domain} wants to perform
              <br />
              the following action
            </Typography>
          </VerticalFlex>

          {/* Actions  */}
          {
            {
              [DAppProviderRequest.AVALANCHE_BRIDGE_ASSET]: (
                <BridgeTransferAsset action={action} />
              ),
            }[action.method || 'unknown']
          }
          {action.error && (
            <VerticalFlex margin="16px 0 0 0" width={'100%'}>
              <Typography size={12} height="15px" margin="0 0 8px 0">
                Error:
              </Typography>
              <Card height="105px" padding="16px 0">
                <Scrollbars
                  style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
                >
                  <VerticalFlex padding="0 16px">
                    <Typography size={12} height="17px" wordBreak="break-all">
                      {action.error}
                    </Typography>
                  </VerticalFlex>
                </Scrollbars>
              </Card>
            </VerticalFlex>
          )}

          {/* Action Buttons */}
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
                updateAction({
                  status: ActionStatus.SUBMITTING,
                  id: action.id,
                });
              }}
            >
              Approve
            </PrimaryButton>
          </HorizontalFlex>
        </SignTxRenderErrorBoundary>
      </VerticalFlex>
    </>
  );
}
