import {
  Blockchain,
  TrackerViewProps,
  TransactionDetails,
  useBridgeConfig,
  useBridgeSDK,
  useTxTracker,
} from '@avalabs/bridge-sdk';
import {
  BridgeIcon,
  HorizontalFlex,
  InfoIcon,
  SubTextTypography,
  TextButton,
  Tooltip,
  toast,
  TransactionToast,
  Typography,
  VerticalFlex,
  TransactionToastType,
} from '@avalabs/react-components';
import { getAvalancheProvider } from '@src/background/services/bridge/getAvalancheProvider';
import { getEthereumProvider } from '@src/background/services/bridge/getEthereumProvider';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { HistoryItemLink } from './components/HistoryItemLink';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useEffect } from 'react';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { BridgeTransaction } from '@src/background/services/bridge/models';
import { TransactionNormal } from '@avalabs/wallet-react-components';
import { ElapsedTimer } from '@src/pages/Bridge/components/ElapsedTimer';

const IconCircle = styled(HorizontalFlex)<{ pending: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => `${theme.colors.stroke1}`};

  @keyframes spinner {
    0% {
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) rotate(360deg);
    }
  }

  ${({ pending, theme }) =>
    pending &&
    `
	&:before {
    animation: 2s linear infinite spinner;
    animation-play-state: inherit;
    border: solid 2px transparent;
    border-bottom-color: ${theme.colors.secondary1};
    border-radius: 50%;
    content: '';
    height: 34px;
    width: 34px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    will-change: transform;
  }
	`};
`;

type TransactionBridgeItem = TransactionNormal &
  BridgeTransaction &
  TransactionDetails;

export function TransactionBridge({
  pending,
  item,
}: {
  item: TransactionBridgeItem;
  pending?: boolean;
}) {
  const theme = useTheme();
  const history = useHistory();
  const fromAvalancheToEthereum =
    item.sourceNetwork === Blockchain.AVALANCHE ||
    item.to === '0x0000000000000000000000000000000000000000';
  const { network } = useNetworkContext();
  const ethereumProvider = getEthereumProvider(network);
  const avalancheProvider = getAvalancheProvider(network);
  const { config } = useBridgeConfig();
  const { removeBridgeTransaction } = useBridgeContext();
  const { activeAccount } = useAccountsContext();
  const { transactionDetails, bridgeAssets, setTransactionDetails } =
    useBridgeSDK();

  const txProps: TrackerViewProps | undefined =
    pending && item?.sourceTxHash
      ? // @TODO: breaking rules of hook.. useTxTracker should prob not be a hook
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useTxTracker(
          item.sourceNetwork,
          item.sourceTxHash,
          item.timeStamp,
          avalancheProvider,
          ethereumProvider,
          setTransactionDetails,
          config,
          activeAccount?.addressC,
          transactionDetails,
          bridgeAssets
        )
      : undefined;

  useEffect(() => {
    if (txProps?.complete) {
      toast.custom(
        <TransactionToast
          status="Bridge Successful!"
          type={TransactionToastType.SUCCESS}
          text={`You received ${txProps.amount} ${txProps.symbol}!`}
        />,
        { id: txProps.sourceTxHash, duration: Infinity }
      );
      removeBridgeTransaction({ ...txProps });
    }
    // We only want this to trigger when `complete` switches to `true` and on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txProps?.complete]);

  return (
    <HorizontalFlex width="100%" justify="space-between" align="center">
      <div style={{ position: 'relative' }}>
        <IconCircle pending={!!pending}>
          <BridgeIcon height="18px" color={theme.colors.stroke2} />
        </IconCircle>
      </div>

      <HorizontalFlex flex={1} justify={'space-between'} margin={'0 0 0 16px'}>
        <VerticalFlex width="100%">
          <HorizontalFlex justify="space-between" width="100%">
            <Typography size={16} weight={500} height="24px">
              {pending ? 'Bridging...' : 'Bridge'}
            </Typography>
            <Typography size={14} height="24px">
              {item.amountDisplayValue} {item.tokenSymbol}
            </Typography>
          </HorizontalFlex>
          {fromAvalancheToEthereum ? (
            <SubTextTypography size={12} height="17px">
              Avalanche -&gt; Ethereum
            </SubTextTypography>
          ) : (
            <SubTextTypography size={12} height="17px">
              Ethereum -&gt; Avalanche
            </SubTextTypography>
          )}
        </VerticalFlex>
        <HorizontalFlex align="flex-start">
          {pending ? (
            <VerticalFlex align="flex-end">
              <Typography
                size={14}
                height="24px"
                style={{ whiteSpace: 'nowrap' }}
              >
                {item.createdAt && (
                  <span style={{ display: 'inline-flex', marginRight: '6px' }}>
                    <Tooltip
                      placement="bottom"
                      content={
                        <HorizontalFlex align="center" justify="space-between">
                          {txProps && (
                            <Typography size={12} margin="0 40px 0 0">
                              Number of confirmations:{' '}
                              {txProps.confirmationCount > // to avoid showing 16/15 since confirmations keep going up
                              txProps.requiredConfirmationCount
                                ? txProps.requiredConfirmationCount
                                : txProps.confirmationCount}
                              /{txProps.requiredConfirmationCount}
                            </Typography>
                          )}
                          <ElapsedTimer startTime={item.createdAt} />
                        </HorizontalFlex>
                      }
                    >
                      <InfoIcon height="12px" color={theme.colors.icon2} />
                    </Tooltip>
                  </span>
                )}
                {item.amount} {item.symbol}
              </Typography>
              <TextButton
                onClick={() => {
                  history.push(
                    `/bridge/transaction-status/${item.sourceNetwork}/${
                      item.sourceTxHash
                    }/${
                      item.createdAt
                        ? Date.parse(item.createdAt.toString())
                        : item.timestamp || item.timeStamp || Date.now()
                    }`
                  );
                }}
              >
                View
              </TextButton>
            </VerticalFlex>
          ) : (
            <HistoryItemLink explorerLink={item.explorerLink} />
          )}
        </HorizontalFlex>
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
