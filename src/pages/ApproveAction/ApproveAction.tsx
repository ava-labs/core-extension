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
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useApproveAction } from '@src/hooks/useApproveAction';
import Scrollbars from 'react-custom-scrollbars-2';
import { useTheme } from 'styled-components';
import { useGetRequestId } from '../../hooks/useGetRequestId';
import { SignTxRenderErrorBoundary } from '../SignTransaction/components/SignTxRenderErrorBoundary';
import { BridgeTransferAsset } from './BridgeTransferAsset';
import { Trans, useTranslation } from 'react-i18next';
import { LedgerAppType } from '@src/contexts/LedgerProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useLedgerDisconnectedDialog } from '../SignTransaction/hooks/useLedgerDisconnectedDialog';
import { LedgerApprovalOverlay } from '../SignTransaction/LedgerApprovalOverlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';

export function ApproveAction() {
  const { t } = useTranslation();
  const theme = useTheme();
  const requestId = useGetRequestId();
  const { action, updateAction } = useApproveAction(requestId);
  const { network } = useNetworkContext();
  const isUsingLedgerWallet = useIsUsingLedgerWallet();

  useLedgerDisconnectedDialog(window.close, LedgerAppType.AVALANCHE, network);

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

  const renderLedgerApproval = () => {
    if (action.status === ActionStatus.SUBMITTING) {
      return <LedgerApprovalOverlay displayData={action.displayData} />;
    }
  };

  return (
    <>
      <VerticalFlex width="100%" padding="0 16px" align="center">
        <SignTxRenderErrorBoundary>
          {renderLedgerApproval()}

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
              <Trans
                i18nKey="{{domain}} wants to perform <br /> the following action"
                values={{ domain: action.site?.domain }}
              />
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
                {t('Error:')}
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
              disabled={action.status === ActionStatus.SUBMITTING}
              onClick={() => {
                updateAction({
                  status: ActionStatus.ERROR_USER_CANCELED,
                  id: action.id,
                });
                window.close();
              }}
            >
              {t('Reject')}
            </SecondaryButton>
            <PrimaryButton
              width="168px"
              size={ComponentSize.LARGE}
              disabled={action.status === ActionStatus.SUBMITTING}
              onClick={() => {
                updateAction(
                  {
                    status: ActionStatus.SUBMITTING,
                    id: action.id,
                  },
                  isUsingLedgerWallet // wait for the response only for ledger wallets
                );
              }}
            >
              {t('Approve')}
            </PrimaryButton>
          </HorizontalFlex>
        </SignTxRenderErrorBoundary>
      </VerticalFlex>
    </>
  );
}
