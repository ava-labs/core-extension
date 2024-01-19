import { useWalletContext } from '@src/contexts/WalletProvider';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { NoTransactions } from './components/NoTransactions';
import { isSameDay, endOfYesterday, endOfToday, format } from 'date-fns';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  TransactionType,
  TxHistoryItem,
} from '@src/background/services/history/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useTranslation } from 'react-i18next';
import { isBitcoin } from '@src/utils/isBitcoin';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { ActivityCard } from './components/History/components/ActivityCard/ActivityCard';
import { InProgressBridgeActivityCard } from './components/History/components/InProgressBridge/InProgressBridgeActivityCard';
import {
  Button,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { isNFT } from '@src/background/services/balances/nft/utils/isNFT';
import { usePendingBridgeTransactions } from '../Bridge/hooks/usePendingBridgeTransactions';

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
  SWAP = 'Swap',
  NFTS = 'NFTs',
}

export function WalletRecentTxs({
  isEmbedded = false,
  tokenSymbolFilter,
}: WalletRecentTxsProps) {
  const { t, i18n } = useTranslation();
  const FilterItems = {
    [FilterType.ALL]: t('All'),
    [FilterType.BRIDGE]: t('Bridge'),
    [FilterType.SWAP]: t('Swap'),
    [FilterType.NFTS]: t('NFTs'),
    [FilterType.CONTRACT_CALL]: t('Contract Call'),
    [FilterType.INCOMING]: t('Incoming'),
    [FilterType.OUTGOING]: t('Outgoing'),
  };

  const { getTransactionHistory } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  const yesterday = endOfYesterday();
  const today = endOfToday();
  const [unfilteredTxHistory, setUnfilteredTxHistory] = useState<
    TxHistoryItem[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    FilterType.ALL
  );

  const { network } = useNetworkContext();

  /*
   * If a tokenSymbolFilter exists, we need to filter out the bridge
   * transactions to only show the bridge transactions for the token being viewed.
   * If there is no tokenSymbolFilter, then we just return all the current bridge transactions
   * because its probably being rendered in the all activity list.
   */
  const bridgeTransactions = usePendingBridgeTransactions();

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

  const explorerUrl = useMemo(() => {
    if (!network || !activeAccount) {
      return undefined;
    }

    const address = isBitcoin(network)
      ? activeAccount.addressBTC
      : activeAccount.addressC;

    // Some WalletConnect accounts may come without the BTC address.
    if (!address) {
      return undefined;
    }

    return getExplorerAddressByNetwork(network, address, 'address');
  }, [network, activeAccount]);

  const baseFilteredTxHistory = useMemo(() => {
    function isPendingBridge(tx: TxHistoryItem) {
      return Object.values(bridgeTransactions).some(
        (bridge) =>
          bridge.sourceTxHash === tx.hash ||
          (!!bridge.targetTxHash && bridge.targetTxHash === tx.hash)
      );
    }

    function shouldTxBeKept(tx: TxHistoryItem) {
      if (tx.isBridge && isPendingBridge(tx)) {
        return false;
      }
      return true;
    }

    return unfilteredTxHistory
      .filter((tx) => {
        if (tokenSymbolFilter) {
          return tokenSymbolFilter === tx.tokens?.[0]?.symbol;
        } else {
          return true;
        }
      })
      .filter((tx) => shouldTxBeKept(tx));
  }, [unfilteredTxHistory, bridgeTransactions, tokenSymbolFilter]);

  const filteredTxHistory = useMemo(() => {
    function shouldTxBeKept(tx: TxHistoryItem, filter: FilterType) {
      if (filter === FilterType.ALL) {
        return true;
      } else if (filter === FilterType.BRIDGE) {
        return tx.isBridge;
      } else if (filter === FilterType.SWAP) {
        return tx.type === TransactionType.SWAP;
      } else if (filter === FilterType.CONTRACT_CALL) {
        return tx.isContractCall && tx.type !== TransactionType.SWAP;
      } else if (filter === FilterType.INCOMING) {
        return tx.isIncoming;
      } else if (filter === FilterType.OUTGOING) {
        return tx.isOutgoing;
      } else if (filter === FilterType.NFTS) {
        return (
          tx.type === TransactionType.NFT_BUY ||
          (tx.type === TransactionType.TRANSFER &&
            tx.tokens[0] &&
            isNFT(tx.tokens[0].type))
        );
      } else {
        return false;
      }
    }

    return baseFilteredTxHistory.filter((tx) =>
      shouldTxBeKept(tx, selectedFilter)
    );
  }, [baseFilteredTxHistory, selectedFilter]);

  const getDayString = (timestamp: string) => {
    const date = new Date(timestamp);
    const isToday = isSameDay(today, date);
    const isYesterday = isSameDay(yesterday, date);

    return isToday
      ? t('Today')
      : isYesterday
      ? t('Yesterday')
      : i18n.language === 'en'
      ? format(date, 'MMMM do')
      : new Intl.DateTimeFormat(i18n.language, {
          month: 'long',
          day: '2-digit',
        }).format(date);
  };

  const FilterItem = ({ keyName, onClick }) => {
    function onClickHandler() {
      onClick(keyName);
    }
    return (
      <MenuItem
        disableRipple
        onClick={onClickHandler}
        sx={{ height: 32, minHeight: 32 }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant="body2">{FilterItems[keyName]}</Typography>
          {selectedFilter === keyName && <CheckIcon size={12} />}
        </Stack>
      </MenuItem>
    );
  };

  function handleFilterChange(keyName) {
    setSelectedFilter(keyName);
    setShowFilterMenu(false);
  }

  return (
    <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
      <Stack
        sx={{ flexGrow: 1, p: isEmbedded ? '0' : '4px 16px 68px', rowGap: 1 }}
      >
        {baseFilteredTxHistory.length > 0 && (
          <Stack
            sx={(theme) => ({
              position: 'absolute',
              right: theme.spacing(2),
              top: theme.spacing(1),
            })}
          >
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',
                justifyContent: 'flex-end',
                mb: 1,
                mt: 0.5,
              }}
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
              }}
              data-testid="filter-activity-menu"
            >
              <Typography
                variant="caption"
                sx={{
                  m: '0 8px 0 5px',
                  fontWeight: 'fontWeightMedium',
                }}
              >
                {t('Display')}: {FilterItems[selectedFilter]}
              </Typography>
              {showFilterMenu ? (
                <ChevronUpIcon size={20} />
              ) : (
                <ChevronDownIcon size={20} />
              )}
            </Stack>
            {showFilterMenu && (
              <MenuList
                data-testid="filter-activity-options"
                sx={{
                  width: 180,
                  justifyContent: 'flex-start',
                  zIndex: 1,
                }}
              >
                {Object.keys(FilterItems).map((filterItem) => (
                  <FilterItem
                    key={filterItem}
                    keyName={filterItem}
                    onClick={handleFilterChange}
                  />
                ))}
              </MenuList>
            )}
          </Stack>
        )}

        {filteredTxHistory.length === 0 ? (
          <NoTransactions loading={loading} />
        ) : (
          <>
            {bridgeTransactions &&
              Object.values(filteredBridgeTransactions).length > 0 &&
              (selectedFilter === 'All' || selectedFilter === 'Bridge') && (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'fontWeightSemibold',
                      m: '8px 0 13px',
                    }}
                  >
                    {t('Pending')}
                  </Typography>

                  {Object.values(filteredBridgeTransactions).map((tx, i) => (
                    <InProgressBridgeActivityCard
                      key={`${tx.sourceTxHash}-${i}`}
                      tx={tx}
                    />
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
                      variant="body2"
                      sx={{
                        fontWeight: 'fontWeightSemibold',
                      }}
                      margin={index === 0 ? '8px 0 13px' : '8px 0'}
                    >
                      {getDayString(tx.timestamp)}
                    </Typography>
                  )}
                  <ActivityCard historyItem={tx} />
                </Fragment>
              );
            })}
          </>
        )}
        {explorerUrl && !loading && !!filteredTxHistory.length && (
          <Stack sx={{ flexDirection: 'row', width: '100%', px: 2, my: 2 }}>
            <Button
              data-testid="add-account-button"
              fullWidth
              width="100%"
              onClick={() => {
                window.open(explorerUrl, '_blank', 'noreferrer');
              }}
            >
              {t('View on explorer')}
            </Button>
          </Stack>
        )}
      </Stack>
    </Scrollbars>
  );
}
