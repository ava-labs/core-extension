import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ChevronLeftIcon,
  HelpCircleIcon,
  IconButton,
  MobileStepper,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';

import { Overlay } from '@src/components/common/Overlay';
import { ActionStatus } from '@src/background/services/actions/models';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TransactionDetailItem } from '@src/components/common/approval/TransactionDetailItem';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';

import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { TxBalanceChange } from '../SignTransaction/components/TxBalanceChange';
import { SpendLimitInfo } from '../SignTransaction/components/SpendLimitInfo/SpendLimitInfo';
import { NetworkDetails } from '../SignTransaction/components/ApprovalTxDetails';
import { useFeeCustomizer } from './hooks/useFeeCustomizer';
import { TransactionDetailsCardContent } from './components/TransactionDetailsCardContent';
import { DetailedCardWrapper } from './components/DetailedCardWrapper';
import { FlexScrollbars } from '@src/components/common/FlexScrollbars';
import { hasDefined } from '@src/background/models';

export function TxBatchApprovalScreen() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const {
    action,
    updateAction,
    cancelHandler,
    error: actionError,
  } = useApproveAction(requestId, true);
  const [network, setNetwork] = useState<NetworkWithCaipId>();
  const { getNetwork } = useNetworkContext();
  const { isCalculatingFee, feeError, hasEnoughForNetworkFee } =
    useFeeCustomizer({
      action,
      network,
    });

  const { displayData } = action ?? {};
  const isFeeValid =
    !actionError && !feeError && !isCalculatingFee && hasEnoughForNetworkFee;

  useEffect(() => {
    if (!action?.caipId) {
      return;
    }

    setNetwork(getNetwork(action.caipId));
  }, [getNetwork, action?.caipId]);

  const handleRejection = useCallback(() => {
    cancelHandler();
  }, [cancelHandler]);

  const signTx = useCallback(() => {
    updateAction({
      status: ActionStatus.SUBMITTING,
      id: requestId,
    });
  }, [requestId, updateAction]);

  useWindowGetsClosedOrHidden(cancelHandler);

  const [index, setIndex] = useState(-1);
  const [isDetailedView, setIsDetailedView] = useState(false);

  if (
    !action ||
    !action.signingRequests ||
    !action.displayData ||
    !hasDefined(action, 'actionId')
  ) {
    return <LoadingOverlay />;
  }

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}
      >
        <Stack sx={{ flex: 1, width: 1, px: 2 }}>
          <Box
            sx={{
              width: '100%',
              pt: 1,
              pb: 2,
              height: '56px',
            }}
          >
            <Typography variant="h4">
              {t('Approve {{count}} transactions', {
                count: action.signingRequests.length,
              })}
            </Typography>
          </Box>

          <Stack sx={{ flexGrow: 1 }}>
            <FlexScrollbars>
              <Stack
                sx={{
                  width: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <Stack sx={{ width: '100%', gap: 3, pt: 1 }}>
                  {displayData.details.map((section, sectionIndex) => (
                    <ApprovalSection key={`tx-detail-section-${sectionIndex}`}>
                      {section.title && (
                        <ApprovalSectionHeader label={section.title} />
                      )}
                      <ApprovalSectionBody sx={{ py: 1 }}>
                        {sectionIndex === 0 && network && (
                          <NetworkDetails network={network} />
                        )}
                        {section.items.map((item, itemIndex) => (
                          <TransactionDetailItem
                            key={`tx-detail.${sectionIndex}.${itemIndex}`}
                            item={item}
                          />
                        ))}
                      </ApprovalSectionBody>
                    </ApprovalSection>
                  ))}

                  {action.displayData.balanceChange && (
                    <TxBalanceChange
                      ins={action.displayData.balanceChange.ins}
                      outs={action.displayData.balanceChange.outs}
                      isSimulationSuccessful={
                        action.displayData.isSimulationSuccessful
                      }
                    />
                  )}

                  <Stack
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      mt: -2,
                    }}
                  >
                    <Tooltip
                      title={t('Shows details of each transaction on its own')}
                    >
                      <Button
                        color="secondary"
                        size="medium"
                        onClick={() => {
                          if (isDetailedView) {
                            setIndex(-1);
                            setIsDetailedView(false);
                          } else {
                            setIndex(0);
                            setIsDetailedView(true);
                          }
                        }}
                      >
                        {t('See Details')}
                      </Button>
                    </Tooltip>
                  </Stack>

                  {action.displayData.tokenApprovals && (
                    <SpendLimitInfo
                      {...action.displayData.tokenApprovals}
                      isEditable={false}
                      actionId={requestId}
                    />
                  )}
                </Stack>
              </Stack>
            </FlexScrollbars>
          </Stack>
          <Stack
            direction="row"
            sx={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              width: '100%',
              justifyContent: 'space-between',
              pt: 1.5,
              pb: 1,
              gap: 1,
            }}
          >
            <Button
              color="secondary"
              data-testid="batch-reject-btn"
              disabled={action.status === ActionStatus.SUBMITTING}
              size="large"
              fullWidth
              onClick={handleRejection}
            >
              {t('Reject')}
            </Button>
            <Button
              data-testid="batch-approve-btn"
              disabled={
                action.status === ActionStatus.SUBMITTING ||
                !isFeeValid ||
                !displayData
              }
              isLoading={
                action.status === ActionStatus.SUBMITTING ||
                !displayData ||
                isCalculatingFee
              }
              size="large"
              fullWidth
              onClick={signTx}
            >
              {t('Approve All')}
            </Button>
          </Stack>
        </Stack>
        <Overlay in={isDetailedView} isBackgroundFilled>
          <Stack sx={{ width: '100%', height: '100%', gap: 1 }}>
            <Stack
              sx={{
                pt: 1,
                pl: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  setIndex(-1);
                  setIsDetailedView(false);
                }}
              >
                <ChevronLeftIcon size={32} />
              </IconButton>
            </Stack>
            <Stack
              sx={{
                width: 1,
                flexDirection: 'row',
                flexWrap: 'nowrap',
                gap: 2,
                flexGrow: 1,
                transition: 'transform .2s ease-in-out',
                transform: `translateX(-${index * 336}px)`,
              }}
            >
              {action.signingRequests.map((currentTx, txIndex) => (
                <DetailedCardWrapper
                  key={`card-${txIndex}`}
                  isFirst={txIndex === 0}
                  isLast={false}
                  onClick={
                    txIndex === index ? undefined : () => setIndex(txIndex)
                  }
                >
                  <TransactionDetailsCardContent
                    tx={currentTx}
                    handleRejection={handleRejection}
                    network={network}
                    action={action}
                    index={txIndex}
                    setIndex={setIndex}
                    isFirst={txIndex === 0}
                    isLast={false}
                    hasEnoughForFee={hasEnoughForNetworkFee}
                  />
                </DetailedCardWrapper>
              ))}

              <DetailedCardWrapper
                isFirst={false}
                isLast={true}
                onClick={
                  index === action.signingRequests.length
                    ? undefined
                    : () => setIndex(action.signingRequests.length)
                }
              >
                <Stack
                  sx={{
                    width: 1,
                    flexGrow: 1,
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    pt: 6,
                    pb: 3,
                    px: 5,
                  }}
                >
                  <HelpCircleIcon size={54} />
                  <Typography variant="h5">
                    {t('Approve all transactions?')}
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    alignItems: 'flex-end',
                    width: '100%',
                    justifyContent: 'space-between',
                    px: 3,
                    pb: 2,
                    gap: 2,
                  }}
                >
                  <Button
                    data-testid="transaction-approve-btn"
                    disabled={
                      action.status === ActionStatus.SUBMITTING || !isFeeValid
                    }
                    isLoading={
                      action.status === ActionStatus.SUBMITTING ||
                      isCalculatingFee
                    }
                    size="medium"
                    fullWidth
                    onClick={signTx}
                  >
                    {t('Approve All')}
                  </Button>
                  <Button
                    color="secondary"
                    data-testid="transaction-reject-btn"
                    disabled={action.status === ActionStatus.SUBMITTING}
                    size="medium"
                    fullWidth
                    onClick={handleRejection}
                  >
                    {t('Reject')}
                  </Button>
                </Stack>
              </DetailedCardWrapper>
            </Stack>
            <MobileStepper
              position="static"
              variant="dots"
              steps={action.signingRequests.length + 1}
              activeStep={index}
              backButton={null}
              nextButton={null}
              sx={{ pb: 3, justifyContent: 'center' }}
            />
          </Stack>
        </Overlay>
      </Stack>
    </Stack>
  );
}
