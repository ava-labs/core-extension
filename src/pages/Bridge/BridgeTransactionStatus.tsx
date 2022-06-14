import {
  VerticalFlex,
  Typography,
  Card,
  HorizontalFlex,
  TextButton,
  HorizontalSeparator,
  ConfirmationTracker,
  toast,
  useDialog,
  CaretIcon,
  TransactionToast,
  TransactionToastType,
  IconDirection,
  PopoutLinkIcon,
  CheckmarkIcon,
  Tooltip,
} from '@avalabs/react-components';
import {
  useBridgeSDK,
  Blockchain,
  usePrice,
  BridgeTransaction,
  getNativeSymbol,
  usePriceForChain,
} from '@avalabs/bridge-sdk';
import styled, { useTheme } from 'styled-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useHistory, useParams } from 'react-router-dom';
import { TokenIcon } from '@src/components/common/TokenImage';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { useEffect, useState } from 'react';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { VsCurrencyType } from '@avalabs/coingecko-sdk';
import { ElapsedTimer } from './components/ElapsedTimer';
import { useIsMainnet } from '@src/hooks/useIsMainnet';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { getExplorerAddress } from '@src/utils/getExplorerAddress';
import { useBridgeAvalancheTokens } from './hooks/useBridgeAvalancheTokens';

const SummaryTokenIcon = styled(TokenIcon)`
  position: absolute;
  top: -28px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  background: ${({ theme }) => theme.colors.bg1};
  border: 8px solid;
  border-color: ${({ theme }) => theme.colors.bg1};
  border-radius: 50%;
`;

const CardLabel = styled(Typography)`
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.text2};
`;

const CaretButton = styled(TextButton)`
  width: 32px;
  height: 32px;
`;

const SummaryAmount = styled.span`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
`;

const SummaryToken = styled.span`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text2};
`;

const SummaryAmountInCurrency = styled(Typography)`
  font-size: 14px;
  line-height: 17px;
  font-weight: 600;
  margin: 3px 0 0 0;
  color: ${({ theme }) => theme.colors.text2};
`;

const TimerBadge = styled(Typography)`
  font-size: 12px;
  font-variant: tabular-nums;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 999px;
  margin-left: 16px;
`;

const PopOutButton = styled(TextButton)`
  display: inline-flex;
  margin-left: 12px;
`;

const StyledCard = styled(Card)<{
  complete: boolean;
}>`
  opacity: ${({ complete }) => (complete ? 0.6 : 1)};
  transition: opacity 0.3s ease;
`;

const BridgeTransactionStatus = () => {
  const history = useHistory();
  const theme = useTheme();
  const params = useParams<{
    complete: string;
    sourceBlockchain: Blockchain;
    txHash: string;
    txTimestamp: string;
  }>();
  const { currencyFormatter, currency } = useSettingsContext();
  const { showDialog, clearDialog } = useDialog();
  const { activeAccount } = useAccountsContext();
  const { currentAsset } = useBridgeSDK();
  const { bridgeTransactions, removeBridgeTransaction } = useBridgeContext();
  const [fromCardOpen, setFromCardOpen] = useState<boolean>(false);
  const [toastShown, setToastShown] = useState<boolean>();
  const isMainnet = useIsMainnet();
  const bridgeTransaction = bridgeTransactions[params.txHash] as
    | BridgeTransaction
    | undefined;
  const tokens = useBridgeAvalancheTokens();
  const token = tokens.find((t) => t.symbol === bridgeTransaction?.symbol);

  const assetPrice = usePrice(
    bridgeTransaction?.symbol || currentAsset,
    currency.toLowerCase() as VsCurrencyType
  );
  const networkPrice = usePriceForChain(bridgeTransaction?.sourceChain);
  const { capture } = useAnalyticsContext();

  const formattedNetworkPrice =
    networkPrice && bridgeTransaction?.sourceNetworkFee
      ? currencyFormatter(
          networkPrice.mul(bridgeTransaction.sourceNetworkFee).toNumber()
        )
      : '-';

  useEffect(() => {
    if (bridgeTransaction?.complete && !toastShown) {
      toast.custom(
        <TransactionToast
          status="Bridge Successful!"
          type={TransactionToastType.SUCCESS}
          text={`You transferred ${bridgeTransaction.amount} ${bridgeTransaction.symbol}!`}
        />,
        { id: bridgeTransaction.sourceTxHash, duration: Infinity }
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
    <VerticalFlex height="100%" width="100%">
      <PageTitle showBackButton={false} variant={PageTitleVariant.PRIMARY}>
        <HorizontalFlex justify="space-between" align="center">
          Transaction Status
          <TextButton
            margin="0 24px 0 0"
            onClick={() => {
              if (bridgeTransaction?.complete) {
                history.replace('/home');
                removeBridgeTransaction(bridgeTransaction.sourceTxHash);
                clearDialog();
              } else {
                showDialog({
                  title: 'Hide Transaction',
                  body: 'Your transaction is processing. Go to Activity to see the current status.',
                  confirmText: 'Hide',
                  width: '343px',
                  onConfirm: async () => {
                    capture('BridgeTransactionHide');
                    history.replace('/home');
                    clearDialog();
                  },
                  cancelText: 'Back',
                  onCancel: () => {
                    capture('BridgeTransactionHideCancel');
                    clearDialog();
                  },
                });
              }
            }}
          >
            Hide
          </TextButton>
        </HorizontalFlex>
      </PageTitle>
      {bridgeTransaction && (
        <Scrollbars>
          <VerticalFlex
            grow="1"
            align="center"
            width="100%"
            padding="0 16px 24px 16px"
          >
            <Card
              style={{ position: 'relative' }}
              margin="32px 0 0 0"
              padding="16px"
            >
              <HorizontalFlex
                justify="space-between"
                grow="1"
                paddingTop="16px"
              >
                <CardLabel>Sending Amount</CardLabel>
                <VerticalFlex>
                  <Typography align="right">
                    <SummaryAmount>
                      {bridgeTransaction.amount?.toNumber()}
                    </SummaryAmount>{' '}
                    <SummaryToken>{bridgeTransaction.symbol}</SummaryToken>
                  </Typography>

                  <SummaryAmountInCurrency align="right">
                    {bridgeTransaction.amount &&
                      currencyFormatter(
                        assetPrice.mul(bridgeTransaction.amount).toNumber()
                      )}
                  </SummaryAmountInCurrency>
                </VerticalFlex>
              </HorizontalFlex>
              <SummaryTokenIcon
                height="56px"
                width="56px"
                src={token?.logoUri}
                name={bridgeTransaction.symbol}
              />
            </Card>
            <StyledCard
              margin="16px 0 0 0"
              padding={`16px 16px ${
                bridgeTransaction.sourceNetworkFee ? 4 : 16
              }px 16px`}
              complete={!!bridgeTransaction.complete}
            >
              <VerticalFlex width="100%">
                <HorizontalFlex justify="space-between" grow="1">
                  <Typography color={theme.colors.text2} size={14}>
                    From
                  </Typography>

                  <HorizontalFlex>
                    <Typography size={14} transform="capitalize">
                      {bridgeTransaction.sourceChain}
                    </Typography>
                    {bridgeTransaction.sourceTxHash && (
                      <Tooltip
                        placement="left"
                        content={
                          <Typography size={14}>View on explorer</Typography>
                        }
                      >
                        <PopOutButton
                          onClick={() =>
                            window.open(
                              getExplorerAddress(
                                bridgeTransaction.sourceChain,
                                bridgeTransaction.sourceTxHash,
                                isMainnet
                              )
                            )
                          }
                        >
                          <PopoutLinkIcon
                            height={'16px'}
                            color={theme.colors.text1}
                          />
                        </PopOutButton>
                      </Tooltip>
                    )}
                  </HorizontalFlex>
                </HorizontalFlex>
                {fromCardOpen && (
                  <>
                    <HorizontalSeparator margin="16px 0 16px 0" />
                    <HorizontalFlex justify="space-between" grow="1">
                      <Typography color={theme.colors.text2} size={14}>
                        Network fee
                      </Typography>

                      <VerticalFlex justify="flex-end">
                        <Typography size={14} align="right">
                          {bridgeTransaction.sourceNetworkFee
                            ?.toNumber()
                            .toFixed(9)}{' '}
                          {getNativeSymbol(bridgeTransaction.sourceChain)}
                        </Typography>
                        <Typography
                          color={theme.colors.text2}
                          size={12}
                          align="right"
                        >
                          ~{formattedNetworkPrice} {currency}
                        </Typography>
                      </VerticalFlex>
                    </HorizontalFlex>
                  </>
                )}
                <HorizontalSeparator margin="16px 0 16px 0" />
                <HorizontalFlex justify="space-between" grow="1" align="center">
                  <Typography color={theme.colors.text2} size={14}>
                    Confirmations
                  </Typography>
                  <div>
                    <Typography size={14}>
                      {bridgeTransaction.confirmationCount > // to avoid showing 16/15 since confirmations keep going up
                      bridgeTransaction.requiredConfirmationCount
                        ? bridgeTransaction.requiredConfirmationCount
                        : bridgeTransaction.confirmationCount}
                      /{bridgeTransaction.requiredConfirmationCount}
                    </Typography>
                    <TimerBadge>
                      <ElapsedTimer
                        startTime={bridgeTransaction.sourceStartedAt}
                        endTime={bridgeTransaction.targetStartedAt}
                      />{' '}
                      {bridgeTransaction.targetStartedAt && (
                        <CheckmarkIcon color={theme.colors.text1} />
                      )}
                    </TimerBadge>
                  </div>
                </HorizontalFlex>
                <ConfirmationTracker
                  started={true}
                  requiredCount={bridgeTransaction.requiredConfirmationCount}
                  currentCount={
                    bridgeTransaction.confirmationCount >
                    bridgeTransaction.requiredConfirmationCount
                      ? bridgeTransaction.requiredConfirmationCount
                      : bridgeTransaction.confirmationCount
                  }
                />

                {bridgeTransaction.sourceNetworkFee && (
                  <CaretButton
                    onClick={() => setFromCardOpen(!fromCardOpen)}
                    margin="4px auto 0 auto"
                  >
                    <CaretIcon
                      height="16px"
                      direction={
                        fromCardOpen ? IconDirection.UP : IconDirection.DOWN
                      }
                      color={theme.colors.icon1}
                    />
                  </CaretButton>
                )}
              </VerticalFlex>
            </StyledCard>
            <StyledCard
              margin="16px 0 0 0"
              padding="16px"
              complete={!!bridgeTransaction.complete}
            >
              <VerticalFlex width="100%">
                <HorizontalFlex justify="space-between" grow="1">
                  <Typography color={theme.colors.text2} size={14}>
                    To
                  </Typography>

                  <HorizontalFlex>
                    <Typography size={14} transform="capitalize">
                      {bridgeTransaction.targetChain}
                    </Typography>
                    {bridgeTransaction.targetTxHash && (
                      <Tooltip
                        placement="left"
                        content={
                          <Typography size={14}>View on explorer</Typography>
                        }
                      >
                        <PopOutButton
                          onClick={() =>
                            window.open(
                              getExplorerAddress(
                                bridgeTransaction.targetChain,
                                bridgeTransaction.targetTxHash || '',
                                isMainnet
                              )
                            )
                          }
                        >
                          <PopoutLinkIcon
                            height={'16px'}
                            color={theme.colors.text1}
                          />
                        </PopOutButton>
                      </Tooltip>
                    )}
                  </HorizontalFlex>
                </HorizontalFlex>
                <HorizontalSeparator margin="16px 0 16px 0" />
                <HorizontalFlex justify="space-between" grow="1" align="center">
                  <Typography color={theme.colors.text2} size={14}>
                    Confirmations
                  </Typography>
                  <div>
                    <Typography size={14}>
                      {bridgeTransaction.complete ? '1' : '0'}/
                      {
                        1 // On the destination network, we just need 1 confirmation
                      }
                    </Typography>
                    <TimerBadge>
                      {bridgeTransaction.targetStartedAt ? (
                        <ElapsedTimer
                          startTime={bridgeTransaction.targetStartedAt}
                          endTime={bridgeTransaction.completedAt}
                        />
                      ) : (
                        '00:00'
                      )}{' '}
                      {bridgeTransaction.complete && (
                        <CheckmarkIcon color={theme.colors.text1} />
                      )}
                    </TimerBadge>
                  </div>
                </HorizontalFlex>

                <ConfirmationTracker
                  started={!!bridgeTransaction.targetStartedAt}
                  requiredCount={
                    1 // On avalanche, we just need 1 confirmation
                  }
                  currentCount={bridgeTransaction.complete ? 1 : 0}
                />
              </VerticalFlex>
            </StyledCard>
          </VerticalFlex>
        </Scrollbars>
      )}
    </VerticalFlex>
  );
};

export default BridgeTransactionStatus;
