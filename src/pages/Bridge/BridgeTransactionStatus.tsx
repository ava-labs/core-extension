import {
  Blockchain,
  usePrice,
  BridgeTransaction,
  getNativeSymbol,
  usePriceForChain,
  useBridgeSDK,
} from '@avalabs/bridge-sdk';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useHistory, useParams } from 'react-router-dom';
import { PageTitle } from '@src/components/common/PageTitle';
import { useEffect, useMemo, useState } from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { VsCurrencyType } from '@avalabs/coingecko-sdk';
import { ElapsedTimer } from './components/ElapsedTimer';
import { useIsMainnet } from '@src/hooks/useIsMainnet';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { getExplorerAddress } from '@src/utils/getExplorerAddress';
import { useLogoUriForBridgeTransaction } from './hooks/useLogoUriForBridgeTransaction';
import { useTranslation } from 'react-i18next';
import { useCoinGeckoId } from '@src/hooks/useCoinGeckoId';
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
} from '@avalabs/k2-components';
import Dialog from '@src/components/common/Dialog';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import { ConfirmationTracker } from '@src/components/common/ConfirmationTracker';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { blockchainToNetwork } from './utils/blockchainConversion';
import { useSyncBridgeConfig } from './hooks/useSyncBridgeConfig';
import { BridgeCard } from './components/BridgeCard';

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
  const { bridgeTransactions, removeBridgeTransaction } = useBridgeContext();
  const [fromCardOpen, setFromCardOpen] = useState<boolean>(false);
  const [toCardOpen, setToCardOpen] = useState<boolean>(false);
  const [toastShown, setToastShown] = useState<boolean>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const isMainnet = useIsMainnet();
  const bridgeTransaction = bridgeTransactions[params.txHash] as
    | BridgeTransaction
    | undefined;
  const coingeckoId = useCoinGeckoId(bridgeTransaction?.symbol);
  const logoUri = useLogoUriForBridgeTransaction(bridgeTransaction);
  const { networks } = useNetworkContext();

  const { bridgeConfig } = useBridgeSDK();
  useSyncBridgeConfig();

  const sourceNetwork = useMemo(() => {
    if (bridgeTransaction) {
      return blockchainToNetwork(
        bridgeTransaction.sourceChain,
        networks,
        bridgeConfig
      );
    }
    return undefined;
  }, [bridgeTransaction, networks, bridgeConfig]);

  const targetNetwork = useMemo(() => {
    if (bridgeTransaction) {
      return blockchainToNetwork(
        bridgeTransaction.targetChain,
        networks,
        bridgeConfig
      );
    }
    return undefined;
  }, [bridgeTransaction, networks, bridgeConfig]);

  const assetPrice = usePrice(
    coingeckoId,
    currency.toLowerCase() as VsCurrencyType
  );
  const networkPrice = usePriceForChain(bridgeTransaction?.sourceChain);
  const targetNetworkPrice = usePriceForChain(bridgeTransaction?.targetChain);
  const { capture } = useAnalyticsContext();

  const formattedNetworkPrice =
    networkPrice && bridgeTransaction?.sourceNetworkFee
      ? currencyFormatter(
          networkPrice.mul(bridgeTransaction.sourceNetworkFee).toNumber()
        )
      : '-';

  const formattedTargetNetworkPrice =
    targetNetworkPrice && bridgeTransaction?.targetNetworkFee
      ? currencyFormatter(
          targetNetworkPrice.mul(bridgeTransaction.targetNetworkFee).toNumber()
        )
      : '-';

  const cappedCount = useMemo(() => {
    if (bridgeTransaction) {
      return Math.min(
        bridgeTransaction?.confirmationCount,
        bridgeTransaction?.requiredConfirmationCount
      );
    }
    return undefined;
  }, [bridgeTransaction]);

  useEffect(() => {
    if (bridgeTransaction?.complete && !toastShown) {
      const toasterId = toast.custom(
        <ToastCard
          onDismiss={() => toast.remove(toasterId)}
          variant="success"
          title={t('Bridge Successful')}
        >
          {t(`You transferred {{amount}} {{symbol}}!`, {
            amount: bridgeTransaction.amount,
            symbol: bridgeTransaction.symbol,
          })}
        </ToastCard>,
        { duration: Infinity }
      );

      setToastShown(true);
    }
    // We only want this to trigger when `complete` switches to `true` and on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridgeTransaction?.complete, toastShown]);

  if (!activeAccount) {
    history.push('/home');
    return null;
  }
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
              if (bridgeTransaction?.complete) {
                history.replace('/home');
                removeBridgeTransaction(bridgeTransaction.sourceTxHash);
              } else {
                setIsDialogOpen(true);
              }
            }}
          >
            {bridgeTransaction?.complete ? t('Close') : t('Hide')}
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
              showComplete={bridgeTransaction.complete}
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
                  <Typography variant="h6">
                    {bridgeTransaction.amount?.toNumber()}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ ml: 1, color: 'text.secondary' }}
                  >
                    {bridgeTransaction.symbol}
                  </Typography>
                </Stack>
              </Stack>

              <Stack sx={{ alignItems: 'flex-end', width: '100%' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {bridgeTransaction.amount &&
                    currencyFormatter(
                      assetPrice.mul(bridgeTransaction.amount).toNumber()
                    )}
                </Typography>
              </Stack>
            </Card>
            <BridgeCard // from chain (Middle Card)
              isWaiting={false} // starts immediately
              isDone={Boolean(bridgeTransaction.targetStartedAt)}
              isTransferComplete={bridgeTransaction.complete}
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
                    {bridgeTransaction.sourceChain}
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
                            isMainnet
                          )
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
                        {bridgeTransaction.sourceNetworkFee
                          ?.toNumber()
                          .toFixed(9)}{' '}
                        {getNativeSymbol(bridgeTransaction.sourceChain)}
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
                        {cappedCount}/
                        {bridgeTransaction.requiredConfirmationCount}
                      </Typography>
                      <ElapsedTimer
                        startTime={bridgeTransaction.sourceStartedAt}
                        endTime={bridgeTransaction.targetStartedAt}
                      />
                    </Stack>
                  </Stack>
                  <ConfirmationTracker
                    started={true}
                    requiredCount={bridgeTransaction.requiredConfirmationCount}
                    currentCount={
                      bridgeTransaction.confirmationCount >
                      bridgeTransaction.requiredConfirmationCount
                        ? bridgeTransaction.requiredConfirmationCount
                        : bridgeTransaction.confirmationCount
                    }
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
                          {bridgeTransaction.sourceNetworkFee
                            ?.toNumber()
                            .toFixed(9)}{' '}
                          {getNativeSymbol(bridgeTransaction.sourceChain)}
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
              isDone={bridgeTransaction.complete}
              isTransferComplete={bridgeTransaction.complete}
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
                    {bridgeTransaction.targetChain}
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
                            isMainnet
                          )
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
              {bridgeTransaction.complete ? (
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
                        {bridgeTransaction.targetNetworkFee
                          ?.toNumber()
                          .toFixed(9)}{' '}
                        {getNativeSymbol(bridgeTransaction.targetChain)}
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
                        {bridgeTransaction.complete ? '1' : '0'}/
                        {
                          1 // On the destination network, we just need 1 confirmation
                        }
                      </Typography>
                      <ElapsedTimer
                        startTime={bridgeTransaction.targetStartedAt || 0}
                        endTime={bridgeTransaction.completedAt}
                      />
                    </Stack>
                  </Stack>
                  {bridgeTransaction.targetStartedAt && (
                    <>
                      <ConfirmationTracker
                        started={!!bridgeTransaction.targetStartedAt}
                        requiredCount={
                          1 // On destination, we just need 1 confirmation
                        }
                        currentCount={bridgeTransaction.complete ? 1 : 0}
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
                              {bridgeTransaction.targetNetworkFee
                                ?.toNumber()
                                .toFixed(9)}{' '}
                              {getNativeSymbol(bridgeTransaction.targetChain)}
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
                'Your transaction is processing. Go to Activity to see the current status.'
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
