import { BridgeTransaction } from '@avalabs/bridge-sdk';
import {
  BridgeIcon,
  HorizontalFlex,
  InfoIcon,
  SubTextTypography,
  TextButton,
  toast,
  Tooltip,
  TransactionToast,
  TransactionToastType,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionERC20 } from '@avalabs/wallet-react-components';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { ElapsedTimer } from '@src/pages/Bridge/components/ElapsedTimer';
import { isPendingBridgeTransaction } from '@src/utils/bridgeTransactionUtils';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { HistoryItemLink } from './components/HistoryItemLink';
import { useBlockchainNames } from './useBlockchainNames';

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

type TransactionBridgeProps = {
  item: TransactionERC20 | BridgeTransaction;
};

export function TransactionBridge({ item }: TransactionBridgeProps) {
  const pending = isPendingBridgeTransaction(item);
  const theme = useTheme();
  const history = useHistory();
  const { removeBridgeTransaction } = useBridgeContext();
  const { sourceBlockchain, targetBlockchain } = useBlockchainNames(item);

  useEffect(() => {
    if (pending && item?.complete) {
      toast.custom(
        <TransactionToast
          status="Bridge Successful!"
          type={TransactionToastType.SUCCESS}
          text={`You transferred ${item.amount} ${item.symbol}!`}
        />,
        { id: item.sourceTxHash, duration: Infinity }
      );
      removeBridgeTransaction(item.sourceTxHash);
    }
    // We only want this to trigger when `complete` switches to `true` and on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending && item?.complete]);

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
            {!pending ? (
              <Typography size={14} height="24px">
                {item.amountDisplayValue} {item.tokenSymbol}
              </Typography>
            ) : null}
          </HorizontalFlex>
          <SubTextTypography size={12} height="17px">
            {sourceBlockchain} -&gt; {targetBlockchain}
          </SubTextTypography>
        </VerticalFlex>
        <HorizontalFlex align="flex-start">
          {pending ? (
            <VerticalFlex align="flex-end">
              <Typography
                size={14}
                height="24px"
                style={{ whiteSpace: 'nowrap' }}
              >
                <span style={{ display: 'inline-flex', marginRight: '6px' }}>
                  <Tooltip
                    placement="bottom"
                    content={
                      <HorizontalFlex align="center" justify="space-between">
                        <Typography size={12} margin="0 40px 0 0">
                          Number of confirmations:{' '}
                          {item.confirmationCount > // to avoid showing 16/15 since confirmations keep going up
                          item.requiredConfirmationCount
                            ? item.requiredConfirmationCount
                            : item.confirmationCount}
                          /{item.requiredConfirmationCount}
                        </Typography>
                        <ElapsedTimer
                          startTime={item.sourceStartedAt}
                          endTime={item.completedAt}
                        />
                      </HorizontalFlex>
                    }
                  >
                    <InfoIcon height="12px" color={theme.colors.icon2} />
                  </Tooltip>
                </span>
                {item.amount?.toString()} {item.symbol}
              </Typography>
              <TextButton
                onClick={() => {
                  history.push(
                    `/bridge/transaction-status/${item.sourceChain}/${item.sourceTxHash}/${item.sourceStartedAt}`
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
