import {
  Card,
  CaretIcon,
  CheckmarkIcon,
  DropDownMenu,
  DropDownMenuItem,
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { Fragment, useEffect, useMemo, useState } from 'react';

import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { NoTransactions } from './components/NoTransactions';
import { isSameDay, endOfYesterday, endOfToday, format } from 'date-fns';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { TransactionBridge } from './components/History/TransactionBridge';
import styled, { useTheme } from 'styled-components';

import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { TxHistoryItem } from '@src/background/services/history/models';
import {
  HistoryReceivedIndicator,
  HistorySentIndicator,
} from './components/History/components/SentReceivedIndicators';
import { HistoryItem } from './components/History/components/HistoryItem';
import { PendingTransactionBridge } from './components/History/PendingTransactionBrigde';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

const StyledDropDownMenu = styled(DropDownMenu)`
  position: absolute;
  right: 16px;
  top: 0;
`;

const StyledDropdownMenuItem = styled(DropDownMenuItem)`
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.stroke2}1A`};

  &:hover {
    background: ${({ theme }) => `${theme.colors.bg1}40`};
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

type WalletRecentTxsProps = {
  isEmbedded?: boolean;
  tokenSymbolFilter?: string;
};

export enum FilterType {
  ALL = 'All',
  BRIDGE = 'Bridge',
  INCOMING = 'Incoming',
  OUTGOING = 'Outgoing',
  CONTRACT_CALL = 'Contract Call',
}

export function WalletRecentTxs({
  isEmbedded = false,
  tokenSymbolFilter,
}: WalletRecentTxsProps) {
  const { getTransactionHistory } = useWalletContext();
  const { activeAccount } = useAccountsContext();
  const [loading, setLoading] = useState<boolean>(false);

  const yesterday = endOfYesterday();
  const today = endOfToday();
  const [unfilteredTxHistory, setUnfilteredTxHistory] = useState<
    TxHistoryItem[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    FilterType.ALL
  );

  const { network } = useNetworkContext();
  const theme = useTheme();

  /*
   * If a tokenSymbolFilter exists, we need to filter out the bridge
   * transactions to only show the bridge transactions for the token being viewed.
   * If there is no tokenSymbolFilter, then we just return all the current bridge transactions
   * because its probably being rendered in the all activity list.
   */
  const { bridgeTransactions } = useBridgeContext();
  const filteredBridgeTransactions = tokenSymbolFilter
    ? Object.values(bridgeTransactions).filter(
        (tx) => tx.symbol === tokenSymbolFilter
      )
    : bridgeTransactions;

  /**
   * When network, addresses, or recentTxHistory changes, new history gets fetched.
   * But recentTxHistory will be removed soon.
   * TODO: Replace recentTxHistory with data we will be getting from balance service
   */
  useEffect(() => {
    setLoading(true);
    getTransactionHistory()
      .then((result) => {
        setUnfilteredTxHistory(result);
      })
      .catch(() => {
        setUnfilteredTxHistory([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [network, activeAccount, getTransactionHistory]);

  const filteredTxHistory = useMemo(() => {
    function isPendingBridge(tx: TxHistoryItem) {
      return Object.values(bridgeTransactions).some(
        (bridge) =>
          bridge.sourceTxHash === tx.hash ||
          (!!bridge.targetTxHash && bridge.targetTxHash === tx.hash)
      );
    }

    function shouldTxBeKept(tx: TxHistoryItem, filter: FilterType) {
      if (tx.isBridge && isPendingBridge(tx)) {
        return false;
      }

      if (filter === FilterType.ALL) {
        return true;
      } else if (filter === FilterType.BRIDGE) {
        return tx.isBridge;
      } else if (filter === FilterType.CONTRACT_CALL) {
        return tx.isContractCall;
      } else if (filter === FilterType.INCOMING) {
        return tx.isIncoming;
      } else if (filter === FilterType.OUTGOING) {
        return tx.isOutgoing;
      } else {
        return false;
      }
    }

    return unfilteredTxHistory
      .filter((tx) => {
        if (tokenSymbolFilter) {
          return tokenSymbolFilter === tx.token?.symbol;
        } else {
          return true;
        }
      })
      .filter((tx) => shouldTxBeKept(tx, selectedFilter));
  }, [
    unfilteredTxHistory,
    selectedFilter,
    bridgeTransactions,
    tokenSymbolFilter,
  ]);

  const getDayString = (timestamp: string) => {
    const date = new Date(timestamp);
    const isToday = isSameDay(today, date);
    const isYesterday = isSameDay(yesterday, date);

    return isToday
      ? 'Today'
      : isYesterday
      ? 'Yesterday'
      : format(date, 'MMMM do');
  };

  const FilterItem = ({ keyName }) => (
    <StyledDropdownMenuItem onClick={() => setSelectedFilter(keyName)}>
      <HorizontalFlex justify="space-between" align="center" width="100%">
        <Typography margin="0 16px 0 0">{keyName}</Typography>
        {selectedFilter === keyName && (
          <CheckmarkIcon color={theme.colors.text1} height="12px" />
        )}
      </HorizontalFlex>
    </StyledDropdownMenuItem>
  );

  return (
    <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
      <VerticalFlex grow="1" padding={isEmbedded ? '0' : '4px 16px 68px'}>
        <StyledDropDownMenu
          coords={{ right: '0' }}
          icon={
            <HorizontalFlex
              padding={'10px'}
              align={'center'}
              justify="space-between"
            >
              <Typography size={12} margin={'0 8px 0 5px'}>
                Display: {selectedFilter}
              </Typography>
              <CaretIcon height={'12px'} color={theme.colors.text1} />
            </HorizontalFlex>
          }
        >
          <VerticalFlex width="200px">
            <FilterItem keyName="All" />
            <FilterItem keyName="Contract Call" />
            <FilterItem keyName="Bridge" />
            <FilterItem keyName="Incoming" />
            <FilterItem keyName="Outgoing" />
          </VerticalFlex>
        </StyledDropDownMenu>

        {filteredTxHistory.length === 0 ? (
          <NoTransactions loading={loading} />
        ) : (
          <>
            {bridgeTransactions &&
              Object.values(filteredBridgeTransactions).length > 0 &&
              (selectedFilter === 'All' || selectedFilter === 'Bridge') && (
                <>
                  <Typography
                    size={14}
                    height="15px"
                    weight={500}
                    margin={'8px 0 13px'}
                  >
                    Pending
                  </Typography>

                  {Object.values(filteredBridgeTransactions).map((tx, i) => (
                    <Card
                      key={`${tx.sourceTxHash}-${i}`}
                      padding={'8px 12px 8px 16px'}
                      margin={'0 0 8px 0'}
                    >
                      <PendingTransactionBridge item={tx} />
                    </Card>
                  ))}
                </>
              )}

            {filteredTxHistory.map((tx, index) => {
              const previousTx = filteredTxHistory[index - 1];
              const isNewDay =
                index === 0 ||
                !previousTx ||
                !isSameDay(
                  new Date(tx.timestamp),
                  new Date(previousTx.timestamp)
                );
              return (
                <Fragment key={index}>
                  {isNewDay && (
                    <Typography
                      size={14}
                      height="15px"
                      weight={500}
                      margin={index === 0 ? '8px 0 13px' : '8px 0'}
                    >
                      {getDayString(tx.timestamp)}
                    </Typography>
                  )}

                  <Card
                    key={tx.hash}
                    padding={'8px 12px 8px 16px'}
                    margin={'0 0 8px 0'}
                  >
                    {(tx.isBridge && selectedFilter === FilterType.ALL) ||
                    selectedFilter === FilterType.BRIDGE ? (
                      <TransactionBridge item={tx} />
                    ) : (
                      <>
                        <HorizontalFlex
                          width={'100%'}
                          justify={'space-between'}
                          align="center"
                        >
                          {tx.isSender ? (
                            <HistorySentIndicator />
                          ) : (
                            <HistoryReceivedIndicator />
                          )}
                          {tx.isContractCall ? (
                            <HistoryItem label={'Contract Call'} item={tx} />
                          ) : (
                            <HistoryItem label={tx.token?.name || ''} item={tx}>
                              <VerticalFlex>
                                <Typography size={14} height="24px">
                                  {tx.isSender ? '-' : '+'}
                                  {tx.amount} {tx.token?.symbol}
                                </Typography>
                              </VerticalFlex>
                            </HistoryItem>
                          )}
                        </HorizontalFlex>
                      </>
                    )}
                  </Card>
                </Fragment>
              );
            })}
          </>
        )}
      </VerticalFlex>
    </Scrollbars>
  );
}
