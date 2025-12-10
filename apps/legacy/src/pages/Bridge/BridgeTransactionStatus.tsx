import { Blockchain, usePrice, useBridgeSDK } from '@avalabs/core-bridge-sdk';
import { useAccountsContext } from '@core/ui';
import { useHistory, useParams } from 'react-router-dom';
import { PageTitle } from '@/components/common/PageTitle';
import { useEffect, useMemo, useState } from 'react';
import { useSettingsContext } from '@core/ui';
import { useBridgeContext } from '@core/ui';
import { VsCurrencyType } from '@avalabs/core-coingecko-sdk';
import { ElapsedTimer } from './components/ElapsedTimer';
import { useIsMainnet } from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import { getExplorerAddress } from '@core/common';
import { useLogoUriForBridgeTransaction } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useCoinGeckoId } from '@core/ui';
import {
  Button,
  Stack,
  toast,
  ToastCard,
  Scrollbars,
  Typography,
  Card,
  Divider,
  ChevronUpIcon,
  IconButton,
  ExternalLinkIcon,
  Collapse,
  ChevronDownIcon,
  useTheme,
} from '@avalabs/core-k2-components';

import Dialog from '@/components/common/Dialog';
import { NetworkLogo } from '@/components/common/NetworkLogo';
import { ConfirmationTracker } from '@/components/common/ConfirmationTracker';
import { useNetworkContext } from '@core/ui';

import {
  blockchainToNetwork,
  getNativeTokenSymbol,
  isUnifiedBridgeTransfer,
} from '@core/common';

import { useBridgeAmounts } from '@core/ui';
import { useSyncBridgeConfig } from '@core/ui';
import { useBridgeNetworkPrice } from '@core/ui';
import { useBridgeTransferStatus } from '@core/ui';

import { BridgeCard } from './components/BridgeCard';
import { OffloadTimerTooltip } from './components/OffloadTimerTooltip';
import { usePendingBridgeTransactions } from '@core/ui';
import { useUnifiedBridgeContext } from '@core/ui';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { BridgeEstimatedTimeWarning } from './components/BridgeEstimatedTimeWarning';

const BridgeTransactionStatus = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const params = useParams<{
    complete: string;
    sourceBlockchain: Blockchain;
    txHash: string;
    txTimestamp: string;
  }>();
  const { currencyFormatter, currency } = useSettingsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { getErrorMessage } = useUnifiedBridgeContext();
  const bridgeTransactions = usePendingBridgeTransactions();
  const { removeBridgeTransaction } = useBridgeContext();
  const [fromCardOpen, setFromCardOpen] = useState<boolean>(false);
  const [toCardOpen, setToCardOpen] = useState<boolean>(false);
  const [toastShown, setToastShown] = useState<boolean>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const isMainnet = useIsMainnet();
  const bridgeTransaction = useMemo(
    () =>
      bridgeTransactions.find(
        ({ sourceTxHash }) => sourceTxHash === params.txHash,
      ),
    [params.txHash, bridgeTransactions],
  );

  const symbol = useMemo(
    () =>
      isUnifiedBridgeTransfer(bridgeTransaction)
        ? bridgeTransaction.asset.symbol
        : bridgeTransaction?.symbol,
    [bridgeTransaction],
  );
  const coingeckoId = useCoinGeckoId(symbol);
  const logoUri = useLogoUriForBridgeTransaction(bridgeTransaction);
  const { networks, getNetwork } = useNetworkContext();

  const { bridgeConfig } = useBridgeSDK();
  useSyncBridgeConfig();

  const sourceNetwork = useMemo(() => {
    if (bridgeTransaction) {
      return blockchainToNetwork(
        bridgeTransaction.sourceChain,
        networks,
        bridgeConfig,
      );
    }
    return undefined;
  }, [bridgeTransaction, networks, bridgeConfig]);

  const targetNetwork = useMemo(() => {
    if (bridgeTransaction) {
      return blockchainToNetwork(
        bridgeTransaction.targetChain,
        networks,
        bridgeConfig,
      );
    }
    return undefined;
  }, [bridgeTransaction, networks, bridgeConfig]);

  const assetPrice = usePrice(
    coingeckoId,
    currency.toLowerCase() as VsCurrencyType,
  );
  const networkPrice = useBridgeNetworkPrice(bridgeTransaction?.sourceChain);
  const targetNetworkPrice = useBridgeNetworkPrice(
    bridgeTransaction?.targetChain,
  );
  const { capture } = useAnalyticsContext();
  const { amount, sourceNetworkFee, targetNetworkFee } =
    useBridgeAmounts(bridgeTransaction);

  const formattedNetworkPrice =
    networkPrice && sourceNetworkFee
      ? currencyFormatter(networkPrice.mul(sourceNetworkFee).toNumber())
      : '-';

  const formattedTargetNetworkPrice =
    targetNetworkPrice && targetNetworkFee
      ? currencyFormatter(targetNetworkPrice.mul(targetNetworkFee).toNumber())
      : '-';

  const {
    isComplete,
    sourceCurrentConfirmations,
    sourceRequiredConfirmations,
    targetCurrentConfirmations,
    targetRequiredConfirmations,
  } = useBridgeTransferStatus(bridgeTransaction);

  const errorCode = isUnifiedBridgeTransfer(bridgeTransaction)
    ? bridgeTransaction.errorCode
    : undefined;
  const hasError = typeof errorCode !== 'undefined';

  useEffect(() => {
    if (bridgeTransaction && isComplete && !toastShown) {
      const errorMessage = errorCode ? getErrorMessage(errorCode) : '';
      const toasterId = toast.custom(
        <ToastCard
          onDismiss={() => toast.remove(toasterId)}
          variant={hasError ? 'error' : 'success'}
          title={hasError ? t('Bridge Failed') : t('Bridge Successful')}
        >
          {hasError
            ? errorMessage
            : t(`You transferred {{amount}} {{symbol}}!`, {
                amount,
                symbol,
              })}
        </ToastCard>,
        { duration: Infinity },
      );

      setToastShown(true);
    }
    // We only want this to trigger when `complete` switches to `true` and on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridgeTransaction?.completedAt, toastShown]);

  const isOffboarding =
    bridgeTransaction?.sourceChain === Blockchain.AVALANCHE &&
    bridgeTransaction?.targetChain === Blockchain.BITCOIN;

  const offboardingDelay =
    bridgeConfig.config?.criticalBitcoin.offboardDelaySeconds;

  const hasOffBoardingDelay = typeof offboardingDelay === 'number';

  if (!activeAccount) {
    history.push('/home');
    return null;
  }

  const bridgeAmount = bridgeTransaction
    ? isUnifiedBridgeTransfer(bridgeTransaction)
      ? new TokenUnit(
          bridgeTransaction.amount,
          bridgeTransaction.asset.decimals,
          bridgeTransaction.asset.symbol,
        ).toDisplay()
      : bridgeTransaction.amount.toString()
    : '';

  return (
    <Stack
      sx={{
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
        pt: 1,
      }}
    >
      <PageTitle onBackClick={() => history.replace('/assets')}>
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {t('Transaction Status')}
          <Button
            variant="text"
            sx={{ mr: 1 }}
            onClick={() => {
              if (bridgeTransaction && isComplete) {
                history.replace('/home');
                removeBridgeTransaction(bridgeTransaction.sourceTxHash);
              } else {
                setIsDialogOpen(true);
              }
            }}
          >
            {isComplete ? t('Close') : t('Hide')}
          </Button>
        </Stack>
      </PageTitle>
      {bridgeTransaction && (
        <Scrollbars>
          <Stack sx={{ alignItems: 'center', mx: 2, mb: 4, rowGap: 2 }}>
            <NetworkLogo
              src={logoUri}
              width="56px"
              height="56px"
              defaultSize={48}
              zIndex={2}
              withBackground
              showComplete={isComplete && !hasError}
              showGlobeMargin={true}
            />
            <Card // sending amount (Top Card)
              sx={{
                width: '100%',
                p: 2,
                pt: 4,
                mt: -5,
              }}
            >
              <Stack
                sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Sending Amount')}
                </Typography>
                <Stack sx={{ flexDirection: 'row' }}>
                  <Typography variant="h6">{bridgeAmount}</Typography>
                  <Typography
                    variant="h6"
                    sx={{ ml: 1, color: 'text.secondary' }}
                  >
                    {symbol}
                  </Typography>
                </Stack>
              </Stack>

              <Stack sx={{ alignItems: 'flex-end', width: '100%' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {amount &&
                    currencyFormatter(assetPrice.mul(amount).toNumber())}
                </Typography>
              </Stack>
            </Card>
            <BridgeCard // from chain (Middle Card)
              isWaiting={false} // starts immediately
              isDone={Boolean(
                isUnifiedBridgeTransfer(bridgeTransaction)
                  ? bridgeTransaction.sourceConfirmationCount >=
                      bridgeTransaction.sourceRequiredConfirmationCount
                  : Boolean(bridgeTransaction?.targetStartedAt),
              )}
              isTransferComplete={isComplete}
            >
              <Stack
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('From')}
                </Typography>
                <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{ textTransform: 'capitalize', mr: 1 }}
                  >
                    {isUnifiedBridgeTransfer(bridgeTransaction)
                      ? bridgeTransaction.sourceChain.chainName
                      : bridgeTransaction.sourceChain}
                  </Typography>
                  <NetworkLogo
                    src={sourceNetwork?.logoUri}
                    width="16px"
                    height="16px"
                    zIndex={2}
                  />
                  {bridgeTransaction.sourceTxHash && (
                    <IconButton
                      size="small"
                      data-testid="source-tx-link"
                      data-tx-hash={bridgeTransaction.sourceTxHash}
                      onClick={() =>
                        window.open(
                          getExplorerAddress(
                            bridgeTransaction.sourceChain,
                            bridgeTransaction.sourceTxHash,
                            isMainnet,
                            getNetwork,
                          ),
                          '_blank',
                          'noreferrer',
                        )
                      }
                      disableRipple
                    >
                      <ExternalLinkIcon />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              {bridgeTransaction.targetStartedAt ? (
                <>
                  <Stack
                    sx={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {t('Network Fee')}
                    </Typography>
                    <Stack
                      sx={{
                        alignItems: 'flex-end',
                      }}
                    >
                      <Typography variant="body2">
                        {' '}
                        {sourceNetworkFee?.toNumber().toFixed(9)}{' '}
                        {getNativeTokenSymbol(bridgeTransaction.sourceChain)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
                      >
                        {formattedNetworkPrice} {currency}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Stack
                    sx={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {t('Time Elapsed')}
                    </Typography>
                    <ElapsedTimer
                      startTime={bridgeTransaction.sourceStartedAt}
                      endTime={bridgeTransaction.targetStartedAt}
                      hasError={hasError}
                    />
                  </Stack>
                </>
              ) : (
                <>
                  <Stack
                    sx={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {t('Confirmations')}
                    </Typography>
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        {sourceCurrentConfirmations}/
                        {sourceRequiredConfirmations}
                      </Typography>
                      <ElapsedTimer
                        startTime={bridgeTransaction.sourceStartedAt}
                        endTime={bridgeTransaction.targetStartedAt}
                        hasError={hasError}
                      />
                    </Stack>
                  </Stack>
                  <ConfirmationTracker
                    started={true}
                    requiredCount={sourceRequiredConfirmations}
                    currentCount={sourceCurrentConfirmations}
                    labelBackgroundColor={theme.palette.grey[850]}
                  />
                  <Collapse in={fromCardOpen}>
                    <Divider sx={{ my: 2 }} />
                    <Stack
                      sx={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {t('Network Fee')}
                      </Typography>
                      <Stack
                        sx={{
                          alignItems: 'flex-end',
                        }}
                      >
                        <Typography variant="body2">
                          {' '}
                          {sourceNetworkFee?.toNumber().toFixed(9)}{' '}
                          {getNativeTokenSymbol(bridgeTransaction.sourceChain)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {formattedNetworkPrice} {currency}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Collapse>
                  <Stack sx={{ justifyContent: 'space-around' }}>
                    <IconButton
                      onClick={() => setFromCardOpen(!fromCardOpen)}
                      disableRipple
                      sx={{
                        pb: 0,
                      }}
                    >
                      {fromCardOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
                    </IconButton>
                  </Stack>
                </>
              )}
            </BridgeCard>
            <BridgeCard // to chain (Bottom Card)
              isWaiting={!bridgeTransaction.targetStartedAt}
              isDone={isComplete}
              isTransferComplete={isComplete}
            >
              <Stack
                sx={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('To')}
                </Typography>
                <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{ textTransform: 'capitalize', mr: 1 }}
                  >
                    {isUnifiedBridgeTransfer(bridgeTransaction)
                      ? bridgeTransaction.targetChain.chainName
                      : bridgeTransaction.targetChain}
                  </Typography>
                  <NetworkLogo
                    src={targetNetwork?.logoUri}
                    width="16px"
                    height="16px"
                    zIndex={2}
                  />
                  {bridgeTransaction.targetTxHash && (
                    <IconButton
                      size="small"
                      data-testid="target-tx-link"
                      data-tx-hash={bridgeTransaction.targetTxHash}
                      onClick={() =>
                        window.open(
                          getExplorerAddress(
                            bridgeTransaction.targetChain,
                            bridgeTransaction.targetTxHash || '',
                            isMainnet,
                            getNetwork,
                          ),
                          '_blank',
                          'noreferrer',
                        )
                      }
                      disableRipple
                    >
                      <ExternalLinkIcon />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              {isComplete ? (
                <>
                  <Stack
                    sx={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {t('Network Fee')}
                    </Typography>
                    <Stack
                      sx={{
                        alignItems: 'flex-end',
                      }}
                    >
                      <Typography variant="body2">
                        {' '}
                        {targetNetworkFee?.toNumber().toFixed(9)}{' '}
                        {getNativeTokenSymbol(bridgeTransaction.targetChain)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
                      >
                        {formattedTargetNetworkPrice} {currency}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Stack
                    sx={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {t('Time Elapsed')}
                    </Typography>
                    {bridgeTransaction.targetStartedAt && (
                      <ElapsedTimer
                        startTime={bridgeTransaction.targetStartedAt}
                        endTime={bridgeTransaction.completedAt}
                        hasError={hasError}
                      />
                    )}
                  </Stack>
                </>
              ) : (
                <>
                  <Stack
                    sx={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {t('Confirmations')}
                    </Typography>
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        {isUnifiedBridgeTransfer(bridgeTransaction)
                          ? bridgeTransaction.targetConfirmationCount // with Unified Bridge, the SDK provides info about the target confirmations
                          : bridgeTransaction.complete // with Legacy Bridge, it's either 0 if tx has not completed yet, or 1 if it has
                            ? '1'
                            : '0'}
                        /
                        {
                          isUnifiedBridgeTransfer(bridgeTransaction)
                            ? bridgeTransaction.targetRequiredConfirmationCount
                            : 1 // With legacy Avalanche Bridge, we just need 1 confirmation on the destination network
                        }
                      </Typography>
                      <ElapsedTimer
                        hasError={hasError}
                        offloadDelayTooltip={
                          isOffboarding && hasOffBoardingDelay ? (
                            <OffloadTimerTooltip
                              offloadDelaySeconds={
                                bridgeConfig.config?.criticalBitcoin
                                  .offboardDelaySeconds || 0
                              }
                            />
                          ) : undefined
                        }
                        startTime={bridgeTransaction.targetStartedAt || 0}
                        endTime={bridgeTransaction.completedAt}
                      />
                    </Stack>
                  </Stack>
                  {bridgeTransaction.targetStartedAt && (
                    <>
                      <ConfirmationTracker
                        currentCount={targetCurrentConfirmations}
                        requiredCount={targetRequiredConfirmations}
                        started={Boolean(bridgeTransaction.targetStartedAt)}
                        labelBackgroundColor={theme.palette.grey[850]}
                      />
                      <Collapse in={toCardOpen}>
                        <Divider sx={{ my: 2 }} />
                        <Stack
                          sx={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            {t('Network Fee')}
                          </Typography>
                          <Stack
                            sx={{
                              alignItems: 'flex-end',
                            }}
                          >
                            <Typography variant="body2">
                              {' '}
                              {targetNetworkFee?.toNumber().toFixed(9)}{' '}
                              {getNativeTokenSymbol(
                                bridgeTransaction.targetChain,
                              )}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary' }}
                            >
                              {formattedTargetNetworkPrice} {currency}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Collapse>
                      <Stack sx={{ justifyContent: 'space-around' }}>
                        <IconButton
                          onClick={() => setToCardOpen(!toCardOpen)}
                          disableRipple
                          sx={{
                            pb: 0,
                            '&.MuiButtonBase-root:hover': {
                              bgcolor: 'transparent',
                            },
                          }}
                        >
                          {toCardOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
                        </IconButton>
                      </Stack>
                    </>
                  )}
                </>
              )}
            </BridgeCard>

            {isUnifiedBridgeTransfer(bridgeTransaction) ? (
              <BridgeEstimatedTimeWarning
                bridgeType={bridgeTransaction.type}
                targetChainName={bridgeTransaction.targetChain.chainName}
              />
            ) : null}
          </Stack>
        </Scrollbars>
      )}
      <Dialog
        open={isDialogOpen}
        isCloseable={false}
        onClose={() => setIsDialogOpen(false)}
        content={
          <Stack sx={{ justifyContent: 'center', width: '100%' }}>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              {t('Hide Transaction')}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
              {t(
                'Your transaction is processing. Go to Activity to see the current status.',
              )}
            </Typography>
            <Stack
              sx={{
                mt: 3,
              }}
            >
              <Button
                sx={{ mb: 1 }}
                onClick={() => {
                  capture('BridgeTransactionHide');
                  history.replace('/assets');
                }}
              >
                {t('Go to Activity')}
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  capture('BridgeTransactionHideCancel');
                  setIsDialogOpen(false);
                }}
              >
                {t('Back')}
              </Button>
            </Stack>
          </Stack>
        }
      />
    </Stack>
  );
};

export default BridgeTransactionStatus;
