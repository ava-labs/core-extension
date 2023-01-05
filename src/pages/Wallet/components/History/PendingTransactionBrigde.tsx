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
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { ElapsedTimer } from '@src/pages/Bridge/components/ElapsedTimer';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { IconCircle } from './TransactionBridge';
import { useBlockchainNames } from './useBlockchainNames';
import { useTranslation } from 'react-i18next';

type PendingTransactionBridgeProps = {
  item: BridgeTransaction;
};

export function PendingTransactionBridge({
  item,
}: PendingTransactionBridgeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const { removeBridgeTransaction } = useBridgeContext();
  const { sourceBlockchain, targetBlockchain } = useBlockchainNames(item);

  useEffect(() => {
    if (item?.complete) {
      toast.custom(
        <TransactionToast
          status={t('Bridge Successful!')}
          type={TransactionToastType.SUCCESS}
          text={t(`You transferred {{amount}} {{symbol}}!`, {
            amount: item.amount,
            symbol: item.symbol,
          })}
        />,
        { id: item.sourceTxHash, duration: Infinity }
      );
      removeBridgeTransaction(item.sourceTxHash);
    }
    // We only want this to trigger when `complete` switches to `true` and on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.complete]);

  return (
    <HorizontalFlex width="100%" justify="space-between" align="center">
      <div style={{ position: 'relative' }}>
        <IconCircle pending={true}>
          <BridgeIcon height="18px" color={theme.colors.stroke2} />
        </IconCircle>
      </div>

      <HorizontalFlex flex={1} justify={'space-between'} margin={'0 0 0 16px'}>
        <VerticalFlex width="100%">
          <HorizontalFlex justify="space-between" width="100%">
            <Typography size={16} weight={500} height="24px">
              {t('Bridging...')}
            </Typography>
          </HorizontalFlex>
          <SubTextTypography size={12} height="17px">
            {sourceBlockchain} -&gt; {targetBlockchain}
          </SubTextTypography>
        </VerticalFlex>
        <HorizontalFlex align="flex-start">
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
                      <Typography size={12} height="1.5" margin="0 40px 0 0">
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
              {t('View')}
            </TextButton>
          </VerticalFlex>
        </HorizontalFlex>
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
