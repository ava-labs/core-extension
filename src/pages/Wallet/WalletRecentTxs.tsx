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
import { Fragment, useCallback, useMemo, useState } from 'react';

import {
  isTransactionERC20,
  isTransactionNormal,
} from '@avalabs/wallet-react-components';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { NoTransactions } from './components/NoTransactions';
import { isSameDay, endOfYesterday, endOfToday, format } from 'date-fns';
import { TransactionERC20 } from './components/History/TransactionERC20';
import { TransactionNormal } from './components/History/TransactionNormal';
import { Blockchain, useBridgeSDK } from '@avalabs/bridge-sdk';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { TransactionBridge } from './components/History/TransactionBridge';
import styled, { useTheme } from 'styled-components';

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
  const { recentTxHistory } = useWalletContext();
  const { bridgeAssets } = useBridgeSDK();
  const yesterday = endOfYesterday();
  const today = endOfToday();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    FilterType.ALL
  );
  const theme = useTheme();
  const { bridgeTransactions } = useBridgeContext();

  const getDayString = (date: Date) => {
    const isToday = isSameDay(today, date);
    const isYesterday = isSameDay(yesterday, date);
    return isToday
      ? 'Today'
      : isYesterday
      ? 'Yesterday'
      : format(date, 'MMMM do');
  };

  const isTransactionBridge = useCallback(
    (tx) => {
      if (bridgeAssets) {
        return (
          Object.values(bridgeAssets).filter(
            (el) =>
              (el.nativeNetwork === Blockchain.AVALANCHE &&
                el.nativeContractAddress.toLowerCase() ===
                  tx.contractAddress.toLowerCase()) ||
              el.wrappedContractAddress.toLowerCase() ===
                tx.contractAddress.toLowerCase() ||
              tx.to === '0x0000000000000000000000000000000000000000' ||
              tx.from === '0x0000000000000000000000000000000000000000'
          ).length > 0
        );
      }

      return false;
    },
    [bridgeAssets]
  );

  const filteredTxHistory = useMemo(
    () =>
      recentTxHistory.filter((tx: any) => {
        const isAll = selectedFilter === FilterType.ALL;
        const isBridge =
          isTransactionBridge(tx) &&
          (isAll || selectedFilter === FilterType.BRIDGE);
        const isIncoming =
          !tx.isSender && (isAll || selectedFilter === FilterType.INCOMING);
        const isOutgoing =
          tx.input === '0x' &&
          tx.isSender &&
          (isAll || selectedFilter === FilterType.OUTGOING);
        const isContractCall =
          isTransactionNormal(tx) &&
          tx.input !== '0x' &&
          (isAll || selectedFilter === FilterType.CONTRACT_CALL);

        if (
          // Return empty if the tx doesn't fit in the currently selected filter
          !(isAll || isBridge || isIncoming || isOutgoing || isContractCall)
        ) {
          return;
        }

        return tokenSymbolFilter
          ? tokenSymbolFilter === (tx?.tokenSymbol || 'AVAX')
          : true;
      }),
    [recentTxHistory, tokenSymbolFilter, selectedFilter, isTransactionBridge]
  );

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

  if (filteredTxHistory.length === 0) {
    return <NoTransactions />;
  }

  return (
    <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
      <VerticalFlex padding={isEmbedded ? '0' : '4px 16px 68px'}>
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

        {bridgeTransactions &&
          Object.values(bridgeTransactions).length > 0 &&
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

              {Object.values(bridgeTransactions).map((tx: any, i) => (
                <Card
                  key={`${tx.sourceTxHash}-${i}`}
                  padding={'8px 12px 8px 16px'}
                  margin={'0 0 8px 0'}
                >
                  <TransactionBridge pending item={tx} />
                </Card>
              ))}
            </>
          )}

        {filteredTxHistory.map((tx: any, index) => {
          const isNewDay =
            index === 0 ||
            !isSameDay(tx.timestamp, filteredTxHistory[index - 1].timestamp);

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
                {isTransactionBridge(tx) &&
                (selectedFilter === FilterType.ALL ||
                  selectedFilter === FilterType.BRIDGE) ? (
                  <TransactionBridge item={tx} />
                ) : (
                  <>
                    {isTransactionERC20(tx) && <TransactionERC20 item={tx} />}
                    {isTransactionNormal(tx) && <TransactionNormal item={tx} />}
                  </>
                )}
              </Card>
            </Fragment>
          );
        })}
      </VerticalFlex>
    </Scrollbars>
  );
}
