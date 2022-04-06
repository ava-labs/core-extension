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
  useTxTracker,
  useTokenInfoContext,
  useBridgeConfig,
  Blockchain,
  usePrice,
} from '@avalabs/bridge-sdk';
import styled, { useTheme } from 'styled-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useHistory, useParams } from 'react-router-dom';
import capitalize from 'lodash/capitalize';
import { useLedgerDisconnectedDialog } from '../SignTransaction/hooks/useLedgerDisconnectedDialog';
import { TokenIcon } from '@src/components/common/TokenImage';
import {
  PageTitleMiniMode,
  PageTitleVariant,
} from '@src/components/common/PageTitle';
import { useEffect, useState } from 'react';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { getEthereumProvider } from '@src/background/services/bridge/getEthereumProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getAvalancheProvider } from '@src/background/services/network/getAvalancheProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { getTransactionLink } from '@avalabs/wallet-react-components';
import { displaySeconds } from '@src/utils/displaySeconds';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { getEtherscanLink } from '@src/utils/getEtherscanLink';

const SummaryTokenIcon = styled(TokenIcon)`
  position: absolute;
  top: -28px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
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

const TimerBadge = styled(Typography)<{
  complete: boolean;
}>`
  font-size: 12px;
  font-variant: tabular-nums;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 999px;
  margin-left: 16px;
  background-color: ${({ complete, theme }) =>
    complete ? theme.colors.success : theme.colors.bg3};
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
  const tokenInfoData = useTokenInfoContext();
  const { showDialog, clearDialog } = useDialog();
  const { activeAccount } = useAccountsContext();
  const {
    currentAsset,
    transactionDetails,
    bridgeAssets,
    setTransactionDetails,
  } = useBridgeSDK();
  const { config } = useBridgeConfig();
  const { createBridgeTransaction, removeBridgeTransaction } =
    useBridgeContext();
  const [fromCardOpen, setFromCardOpen] = useState<boolean>(false);
  const [toastShown, setToastShown] = useState<boolean>();
  const { network } = useNetworkContext();
  const etherscanLink = getEtherscanLink(network);
  const ethereumProvider = getEthereumProvider(network);
  const avalancheProvider = getAvalancheProvider(network);
  const txProps = useTxTracker(
    params.sourceBlockchain,
    params.txHash,
    params.txTimestamp,
    avalancheProvider,
    ethereumProvider,
    setTransactionDetails,
    config,
    activeAccount?.addressC,
    transactionDetails,
    bridgeAssets
  );

  const assetPrice = usePrice(
    txProps?.symbol || currentAsset,
    currency.toLowerCase()
  );

  useLedgerDisconnectedDialog(() => {
    history.goBack();
  });

  useEffect(() => {
    if (txProps?.complete && !toastShown) {
      toast.custom(
        <TransactionToast
          status="Bridge Successful!"
          type={TransactionToastType.SUCCESS}
          text={`You received ${txProps.amount} ${txProps.symbol}!`}
        />,
        { id: txProps.sourceTxHash, duration: Infinity }
      );
      removeBridgeTransaction({ ...txProps });
      setToastShown(true);
    }
    // We only want this to trigger when `complete` switches to `true` and on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txProps?.complete, toastShown]);

  useEffect(() => {
    createBridgeTransaction({
      ...txProps,
    });
    // create a tx upfront incase the user somehow manage to exit without clicking "Hide"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeAccount) {
    history.push('/home');
    return null;
  }

  return (
    <VerticalFlex height="100%" width="100%">
      <PageTitleMiniMode
        showBackButton={false}
        variant={PageTitleVariant.PRIMARY}
      >
        <HorizontalFlex justify="space-between" align="center">
          Transaction Status
          <TextButton
            margin="0 24px 0 0"
            onClick={() => {
              if (txProps.complete || toastShown) {
                history.replace('/home');
                clearDialog();
              } else {
                showDialog({
                  title: 'Hide Transaction',
                  body: 'Your transaction is processing. Go to Activity to see the current status.',
                  confirmText: 'Hide',
                  width: '343px',
                  onConfirm: async () => {
                    if (!txProps?.complete) {
                      // Update in case we closed the extension, re-opened and now leaving
                      await createBridgeTransaction({
                        ...txProps,
                      });
                    }
                    history.replace('/home');
                    clearDialog();
                  },
                  cancelText: 'Back',
                  onCancel: () => {
                    clearDialog();
                  },
                });
              }
            }}
          >
            Hide
          </TextButton>
        </HorizontalFlex>
      </PageTitleMiniMode>
      {txProps && (
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
                    <SummaryAmount>{txProps.amount?.toNumber()}</SummaryAmount>{' '}
                    <SummaryToken>{txProps.symbol}</SummaryToken>
                  </Typography>

                  <SummaryAmountInCurrency align="right">
                    {txProps.amount &&
                      currencyFormatter(
                        assetPrice.mul(txProps.amount).toNumber()
                      )}
                  </SummaryAmountInCurrency>
                </VerticalFlex>
              </HorizontalFlex>
              {transactionDetails && (
                <SummaryTokenIcon
                  height="56px"
                  width="56px"
                  src={tokenInfoData?.[transactionDetails.tokenSymbol]?.logo}
                  name={transactionDetails?.tokenSymbol}
                />
              )}
            </Card>
            <StyledCard
              margin="16px 0 0 0"
              padding={`16px 16px ${txProps.gasCost ? 4 : 16}px 16px`}
              complete={
                !!(txProps.complete || txProps.targetSeconds > 0 || toastShown)
              }
            >
              <VerticalFlex width="100%">
                <HorizontalFlex justify="space-between" grow="1">
                  <Typography color={theme.colors.text2} size={14}>
                    From
                  </Typography>

                  <HorizontalFlex>
                    <Typography size={14}>
                      {capitalize(txProps.sourceNetwork)}
                    </Typography>
                    {(txProps.complete ||
                      txProps.targetSeconds > 0 ||
                      toastShown) &&
                      txProps.sourceTxHash && (
                        <Tooltip
                          placement="left"
                          content={
                            <Typography size={14}>View on explorer</Typography>
                          }
                        >
                          <PopOutButton
                            onClick={() =>
                              window.open(
                                txProps.sourceNetwork === Blockchain.AVALANCHE
                                  ? getTransactionLink(
                                      txProps.sourceTxHash || ''
                                    )
                                  : `${etherscanLink}/tx/${txProps.sourceTxHash}`
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
                          {txProps.gasCost?.toNumber().toFixed(9)}{' '}
                          {txProps.symbol}
                        </Typography>
                        <Typography
                          color={theme.colors.text2}
                          size={12}
                          align="right"
                        >
                          ~{txProps.gasValue?.toNumber().toFixed(2)} USD
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
                      {txProps.confirmationCount > // to avoid showing 16/15 since confirmations keep going up
                      txProps.requiredConfirmationCount
                        ? txProps.requiredConfirmationCount
                        : txProps.confirmationCount}
                      /{txProps.requiredConfirmationCount}
                    </Typography>
                    <TimerBadge
                      complete={
                        !!(
                          txProps.complete ||
                          txProps.targetSeconds > 0 ||
                          toastShown
                        )
                      }
                    >
                      <Typography
                        size={12}
                        margin={
                          txProps.complete ||
                          txProps.targetSeconds > 0 ||
                          toastShown
                            ? '0 4px 0 0'
                            : '0'
                        }
                      >
                        {txProps.sourceSeconds > 0
                          ? displaySeconds(txProps.sourceSeconds)
                          : '00:00'}
                      </Typography>
                      {(txProps.complete ||
                        txProps.targetSeconds > 0 ||
                        toastShown) && (
                        <CheckmarkIcon color={theme.colors.text1} />
                      )}
                    </TimerBadge>
                  </div>
                </HorizontalFlex>
                <ConfirmationTracker
                  started={true}
                  requiredCount={txProps.requiredConfirmationCount}
                  currentCount={
                    txProps.confirmationCount >
                    txProps.requiredConfirmationCount
                      ? txProps.requiredConfirmationCount
                      : txProps.confirmationCount
                  }
                />

                {txProps.gasCost && (
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
              complete={!!(txProps.complete || toastShown)}
            >
              <VerticalFlex width="100%">
                <HorizontalFlex justify="space-between" grow="1">
                  <Typography color={theme.colors.text2} size={14}>
                    To
                  </Typography>

                  <HorizontalFlex>
                    <Typography size={14}>
                      {capitalize(txProps.targetNetwork)}
                    </Typography>
                    {(txProps.complete || toastShown) && txProps.targetTxHash && (
                      <Tooltip
                        placement="left"
                        content={
                          <Typography size={14}>View on explorer</Typography>
                        }
                      >
                        <PopOutButton
                          onClick={() =>
                            window.open(
                              txProps.targetNetwork === Blockchain.AVALANCHE
                                ? getTransactionLink(txProps.targetTxHash || '')
                                : `${etherscanLink}/tx/${txProps.targetTxHash}`
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
                      {txProps.complete || toastShown ? '1' : '0'}/
                      {
                        1 // On the destination network, we just need 1 confirmation
                      }
                    </Typography>
                    <TimerBadge complete={!!(txProps.complete || toastShown)}>
                      <Typography
                        size={12}
                        margin={
                          txProps.complete || toastShown ? '0 4px 0 0' : '0'
                        }
                      >
                        {txProps.targetSeconds > 0
                          ? displaySeconds(txProps.targetSeconds)
                          : '00:00'}
                      </Typography>
                      {(txProps.complete || toastShown) && (
                        <CheckmarkIcon color={theme.colors.text1} />
                      )}
                    </TimerBadge>
                  </div>
                </HorizontalFlex>

                <ConfirmationTracker
                  started={txProps.targetSeconds > 0}
                  requiredCount={
                    1 // On avalanche, we just need 1 confirmation
                  }
                  currentCount={txProps.complete || toastShown ? 1 : 0}
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
