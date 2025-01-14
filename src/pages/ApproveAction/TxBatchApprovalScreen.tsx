import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  ChevronLeftIcon,
  HelpCircleIcon,
  IconButton,
  MobileStepper,
  Scrollbars,
  Stack,
  Tooltip,
  Typography,
  styled,
} from '@avalabs/core-k2-components';
import { AlertType } from '@avalabs/vm-module-types';

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
import { MaliciousTxAlert } from '@src/components/common/MaliciousTxAlert';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';

import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { TxBalanceChange } from '../SignTransaction/components/TxBalanceChange';
import { SpendLimitInfo } from '../SignTransaction/components/SpendLimitInfo/SpendLimitInfo';
import { NetworkDetails } from '../SignTransaction/components/ApprovalTxDetails';
import { AlertBox } from '../Permissions/components/AlertBox';
import { WarningBox } from '../Permissions/components/WarningBox';
import { useFeeCustomizer } from './hooks/useFeeCustomizer';
import { Overlay } from '@src/components/common/Overlay';

const FlexScrollbars = styled(Scrollbars)`
  flex-grow: 1;
  max-height: unset;
  height: 100%;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;

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
  const {
    isCalculatingFee,
    feeError,
    hasEnoughForNetworkFee,
    renderFeeWidget,
  } = useFeeCustomizer({
    actionId: requestId,
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

  if (!action || !action.signingRequests || !action.displayData) {
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

                  {action.displayData.balanceChange && (
                    <TxBalanceChange
                      ins={action.displayData.balanceChange.ins}
                      outs={action.displayData.balanceChange.outs}
                      isSimulationSuccessful={
                        action.displayData.isSimulationSuccessful
                      }
                    />
                  )}

                  {action.displayData.tokenApprovals && (
                    <SpendLimitInfo
                      {...action.displayData.tokenApprovals}
                      isEditable={false}
                      actionId={requestId}
                    />
                  )}

                  {displayData.networkFeeSelector && (
                    <Stack sx={{ width: 1, gap: 1 }}>
                      {renderFeeWidget()}
                      <Typography variant="caption" color="text.secondary">
                        {t(
                          'The settings above will be applied to all transations in this batch.',
                        )}
                      </Typography>
                    </Stack>
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
                !isFeeValid ||
                !displayData
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
                pb: 2,
                pl: 2,
                gap: 2,
                flexGrow: 1,
                transition: 'transform .2s ease-in-out',
                transform: `translateX(-${index * 332}px)`,
              }}
            >
              {action.signingRequests.map((currentTx, txIndex) => (
                <Card
                  key={`tx-${txIndex}`}
                  sx={{
                    display: 'flex',
                    width: 320,
                    flex: '0 0 auto',
                    backgroundColor: 'grey.850',
                    ml: txIndex === 0 ? 1 : 0,
                    position: 'relative',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      opacity: 0.6,
                    }}
                  >
                    {`#${txIndex + 1}`}
                  </Typography>
                  <Stack
                    sx={{
                      width: 1,
                      gap: 1,
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        width: '100%',
                        py: 2,
                        px: 2,
                        zIndex: 1,
                        height: '56px',
                      }}
                    >
                      <Typography variant="h4">
                        {currentTx.displayData.title}
                      </Typography>
                    </Box>
                    <FlexScrollbars>
                      <Stack sx={{ flex: 1, width: 1, px: 2, gap: 2, pb: 3 }}>
                        {currentTx.displayData.alert && (
                          <Stack sx={{ width: 1, px: 2, mb: 1 }}>
                            {currentTx.displayData.alert.type ===
                            AlertType.DANGER ? (
                              <>
                                <MaliciousTxAlert
                                  showAlert
                                  cancelHandler={handleRejection}
                                  actionTitles={
                                    currentTx.displayData.alert.details
                                      .actionTitles
                                  }
                                  title={
                                    currentTx.displayData.alert.details.title
                                  }
                                  description={
                                    currentTx.displayData.alert.details
                                      .description
                                  }
                                />
                                <AlertBox
                                  title={
                                    currentTx.displayData.alert.details.title
                                  }
                                  text={
                                    currentTx.displayData.alert.details
                                      .description
                                  }
                                />
                              </>
                            ) : (
                              <WarningBox
                                title={
                                  currentTx.displayData.alert.details.title
                                }
                                text={
                                  currentTx.displayData.alert.details
                                    .description
                                }
                              />
                            )}
                          </Stack>
                        )}
                        <Stack sx={{ width: '100%', gap: 3, pt: 1 }}>
                          {currentTx.displayData.details.map(
                            (section, sectionIndex) => (
                              <ApprovalSection
                                key={`tx-detail-section-${sectionIndex}`}
                              >
                                {section.title && (
                                  <ApprovalSectionHeader
                                    label={section.title}
                                  />
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
                            ),
                          )}
                          {currentTx.displayData.balanceChange && (
                            <TxBalanceChange
                              ins={currentTx.displayData.balanceChange.ins}
                              outs={currentTx.displayData.balanceChange.outs}
                              isSimulationSuccessful={
                                currentTx.displayData.isSimulationSuccessful
                              }
                            />
                          )}
                          {currentTx.displayData.tokenApprovals && (
                            <SpendLimitInfo
                              {...currentTx.displayData.tokenApprovals}
                              actionId={requestId}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </FlexScrollbars>
                    <Stack
                      sx={{
                        width: 1,
                        gap: 1,
                        px: 2,
                        pb: 2,
                        flexDirection: 'row',
                      }}
                    >
                      <Button
                        size="medium"
                        color="secondary"
                        fullWidth
                        onClick={() => {
                          setIndex(txIndex - 1);
                          console.log('new index', txIndex - 1);
                        }}
                        sx={{
                          visibility: index === 0 ? 'hidden' : 'visible',
                        }}
                      >
                        {t('Previous')}
                      </Button>
                      <Button
                        size="medium"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          setIndex(txIndex + 1);
                          console.log('new index', txIndex + 1);
                        }}
                        sx={{
                          visibility:
                            index === action.signingRequests.length
                              ? 'hidden'
                              : 'visible',
                        }}
                      >
                        {t('Next')}
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              ))}

              <Card
                sx={{
                  display: 'flex',
                  width: 320,
                  flex: '0 0 auto',
                  backgroundColor: 'grey.850',
                  flexDirection: 'column',
                }}
              >
                <Stack
                  sx={{
                    width: 1,
                    flexGrow: 1,
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    py: 6,
                    px: 2,
                  }}
                >
                  <HelpCircleIcon size={72} />
                  <Typography variant="h4">
                    {t('Approve all transactions?')}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    width: '100%',
                    justifyContent: 'space-between',
                    pt: 1.5,
                    px: 3,
                    pb: 2,
                    gap: 1,
                  }}
                >
                  <Button
                    color="secondary"
                    data-testid="transaction-reject-btn"
                    disabled={action.status === ActionStatus.SUBMITTING}
                    size="large"
                    fullWidth
                    onClick={handleRejection}
                  >
                    {t('Reject')}
                  </Button>
                  <Button
                    data-testid="transaction-approve-btn"
                    disabled={
                      action.status === ActionStatus.SUBMITTING || !isFeeValid
                    }
                    isLoading={action.status === ActionStatus.SUBMITTING}
                    size="large"
                    fullWidth
                    onClick={signTx}
                  >
                    {t('Approve')}
                  </Button>
                </Stack>
              </Card>
            </Stack>
            <MobileStepper
              position="static"
              variant="dots"
              steps={action.signingRequests.length + 1}
              activeStep={index}
              backButton={null}
              nextButton={null}
              sx={{ py: 3, justifyContent: 'center' }}
            />
          </Stack>
        </Overlay>
      </Stack>
    </Stack>
  );
}
