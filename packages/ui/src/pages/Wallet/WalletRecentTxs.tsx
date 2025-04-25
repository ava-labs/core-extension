import { Scrollbars } from '@/components/common/scrollbars/Scrollbars';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { useNetworkContext } from '@/contexts/NetworkProvider';
import { useWalletContext } from '@/contexts/WalletProvider';
import {
  Button,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { TxHistoryItem } from '@core/types';
import { getExplorerAddressByNetwork, isNftTokenType } from '@core/utils';
import { endOfToday, endOfYesterday, format, isSameDay } from 'date-fns';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePendingBridgeTransactions } from '../Bridge/hooks/usePendingBridgeTransactions';
import { ActivityCard } from './components/History/components/ActivityCard/ActivityCard';
import { InProgressBridgeActivityCard } from './components/History/components/InProgressBridge/InProgressBridgeActivityCard';
import { NoTransactions } from './components/NoTransactions';

import { Transaction, TransactionType } from '@avalabs/vm-module-types';
import {
  getAddressForChain,
  getBridgedAssetSymbol,
  isNonXPHistoryItem,
  isPchainNetwork,
  isPchainTxHistoryItem,
  isXchainNetwork,
} from '@core/utils';
import { PchainActivityCard } from './components/History/components/ActivityCard/PchainActivityCard';
import { XchainActivityCard } from './components/History/components/ActivityCard/XchainActivityCard';
import {
  PchainFilterTxTypeMap,
  PchainFilterType,
  XchainFilterTxTypeMap,
  XchainFilterType,
} from './models';

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

  const PchainFilterItems = {
    [PchainFilterType.ALL]: t('All'),
    [PchainFilterType.INCOMING]: t('Incoming'),
    [PchainFilterType.OUTGOING]: t('Outgoing'),
    [PchainFilterType.ADD_DELEGATOR_TX]: t('Add Delegator'),
    [PchainFilterType.ADD_SUBNET_VALIDATOR_TX]: t('Add Subnet Validator'),
    [PchainFilterType.ADD_PERMISSIONLESS_VALIDATOR_TX]: t(
      'Add Permissionless Validator',
    ),
    [PchainFilterType.ADD_PERMISSIONLESS_DELEGATOR_TX]: t(
      'Add Permissionless Delegator',
    ),
    [PchainFilterType.ADD_VALIDATOR_TX]: t('Add Validator'),
    [PchainFilterType.ADVANCE_TIME_TX]: t('Advance Time'),
    [PchainFilterType.BASE_TX]: t('BaseTx'),
    [PchainFilterType.CREATE_CHAIN_TX]: t('Create Chain'),
    [PchainFilterType.CREATE_SUBNET_TX]: t('Create Subnet'),
    [PchainFilterType.EXPORT_TX]: t('Export'),
    [PchainFilterType.IMPORT_TX]: t('Import'),
    [PchainFilterType.REWARD_VALIDATOR_TX]: t('Reward Validator'),
    [PchainFilterType.REMOVE_SUBNET_VALIDATOR_TX]: t('Remove Subnet Validator'),
    [PchainFilterType.TRANSFER_SUBNET_OWNERSHIP_TX]: t(
      'Transfer Subnet Ownership',
    ),
    [PchainFilterType.TRANSFORM_SUBNET_TX]: t('Transform Subnet'),
  };

  const XchainFilterItems = {
    [XchainFilterType.ALL]: t('All'),
    [XchainFilterType.INCOMING]: t('Incoming'),
    [XchainFilterType.OUTGOING]: t('Outgoing'),
    [XchainFilterType.BASE_TX]: t('BaseTx'),
    [XchainFilterType.CREATE_ASSET_TX]: t('Create Asset'),
    [XchainFilterType.OPERATION_TX]: t('Operation'),
    [XchainFilterType.IMPORT_TX]: t('Import'),
    [XchainFilterType.EXPORT_TX]: t('Export'),
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
  const { network } = useNetworkContext();

  const [selectedFilter, setSelectedFilter] = useState<
    FilterType | PchainFilterType | XchainFilterType
  >(
    isPchainNetwork(network)
      ? PchainFilterType.ALL
      : isXchainNetwork(network)
        ? XchainFilterType.ALL
        : FilterType.ALL,
  );

  /*
   * If a tokenSymbolFilter exists, we need to filter out the bridge
   * transactions to only show the bridge transactions for the token being viewed.
   * If there is no tokenSymbolFilter, then we just return all the current bridge transactions
   * because its probably being rendered in the all activity list.
   */
  const bridgeTransactions = usePendingBridgeTransactions();

  const filteredBridgeTransactions = tokenSymbolFilter
    ? Object.values(bridgeTransactions).filter(
        (tx) => getBridgedAssetSymbol(tx) === tokenSymbolFilter,
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

    const address = getAddressForChain(network, activeAccount);

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
          (!!bridge.targetTxHash && bridge.targetTxHash === tx.hash),
      );
    }

    function shouldTxBeKept(tx: TxHistoryItem) {
      if (
        isNonXPHistoryItem(tx) &&
        tx.bridgeAnalysis.isBridgeTx &&
        isPendingBridge(tx)
      ) {
        return false;
      }
      return true;
    }

    return unfilteredTxHistory
      .filter((tx) => {
        if (tokenSymbolFilter && isNonXPHistoryItem(tx)) {
          return tokenSymbolFilter === tx.tokens?.[0]?.symbol;
        } else {
          return true;
        }
      })
      .filter((tx) => shouldTxBeKept(tx));
  }, [unfilteredTxHistory, bridgeTransactions, tokenSymbolFilter]);

  function txHistoryItemFilter(
    tx: TxHistoryItem,
    filter: FilterType | PchainFilterType | XchainFilterType,
  ) {
    if (filter === FilterType.ALL) {
      return true;
    } else if (filter === FilterType.BRIDGE) {
      return (
        tx.txType === TransactionType.BRIDGE || tx.bridgeAnalysis.isBridgeTx
      );
    } else if (filter === FilterType.SWAP) {
      return tx.txType === TransactionType.SWAP;
    } else if (filter === FilterType.CONTRACT_CALL) {
      return (
        tx.isContractCall &&
        !tx.bridgeAnalysis.isBridgeTx &&
        tx.txType !== TransactionType.SWAP
      );
    } else if (filter === FilterType.INCOMING) {
      return tx.isIncoming;
    } else if (filter === FilterType.OUTGOING) {
      return tx.isOutgoing;
    } else if (filter === FilterType.NFTS) {
      return (
        tx.txType === TransactionType.NFT_BUY ||
        ((tx.txType === TransactionType.TRANSFER ||
          tx.txType === TransactionType.NFT_RECEIVE ||
          tx.txType === TransactionType.UNKNOWN) &&
          tx.tokens[0] &&
          isNftTokenType(tx.tokens[0].type))
      );
    } else {
      return false;
    }
  }

  function pchainTxHistoryItemFilter(
    tx: TxHistoryItem,
    filter: FilterType | PchainFilterType | XchainFilterType,
  ) {
    if (filter === PchainFilterType.ALL) {
      return true;
    }
    if (filter === PchainFilterType.INCOMING) {
      return !tx.isSender;
    }
    if (filter === PchainFilterType.OUTGOING) {
      return tx.isSender;
    }
    const typeBasedOnFilter = PchainFilterTxTypeMap[filter];

    if (typeBasedOnFilter) {
      return tx.txType === typeBasedOnFilter;
    }

    return false;
  }

  function xchainTxHistoryItemFilter(
    tx: Transaction,
    filter: FilterType | PchainFilterType | XchainFilterType,
  ) {
    if (filter === XchainFilterType.ALL) {
      return true;
    }
    if (filter === XchainFilterType.INCOMING) {
      return !tx.isSender;
    }
    if (filter === XchainFilterType.OUTGOING) {
      return tx.isSender;
    }
    const typeBasedOnFilter = XchainFilterTxTypeMap[filter];

    if (typeBasedOnFilter) {
      return tx.txType === typeBasedOnFilter;
    }

    return false;
  }

  const filteredTxHistory = useMemo(() => {
    function shouldTxBeKept(
      tx: TxHistoryItem,
      filter: FilterType | PchainFilterType | XchainFilterType,
    ) {
      if (isNonXPHistoryItem(tx)) {
        return txHistoryItemFilter(tx, filter);
      } else if (isPchainTxHistoryItem(tx)) {
        return pchainTxHistoryItemFilter(tx, filter);
      } else {
        return xchainTxHistoryItemFilter(tx, filter);
      }
    }

    return baseFilteredTxHistory.filter((tx) =>
      shouldTxBeKept(tx, selectedFilter),
    );
  }, [baseFilteredTxHistory, selectedFilter]);

  const getDayString = (timestamp: string | number) => {
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
    const label = isPchainNetwork(network)
      ? PchainFilterItems[keyName]
      : isXchainNetwork(network)
        ? XchainFilterItems[keyName]
        : FilterItems[keyName];
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
          <Typography
            variant="body2"
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
            title={label}
          >
            {label}
          </Typography>
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
                {t('Display')}:{' '}
                {isPchainNetwork(network)
                  ? PchainFilterItems[selectedFilter]
                  : isXchainNetwork(network)
                    ? XchainFilterItems[selectedFilter]
                    : FilterItems[selectedFilter]}
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
                  width: 240,
                  justifyContent: 'flex-start',
                  zIndex: 1,
                  height: 200,
                }}
              >
                <Scrollbars
                  style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
                >
                  {Object.keys(
                    isPchainNetwork(network)
                      ? PchainFilterItems
                      : isXchainNetwork(network)
                        ? XchainFilterItems
                        : FilterItems,
                  ).map((filterItem) => (
                    <FilterItem
                      key={filterItem}
                      keyName={filterItem}
                      onClick={handleFilterChange}
                    />
                  ))}
                </Scrollbars>
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
                  new Date(previousTx.timestamp),
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
                  {isNonXPHistoryItem(tx) ? (
                    <ActivityCard historyItem={tx} />
                  ) : isPchainTxHistoryItem(tx) ? (
                    <PchainActivityCard historyItem={tx} />
                  ) : (
                    <XchainActivityCard historyItem={tx} />
                  )}
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
