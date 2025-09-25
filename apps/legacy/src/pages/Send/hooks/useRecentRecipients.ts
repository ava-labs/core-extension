import { Contact } from '@avalabs/types';
import { ETHEREUM_ADDRESS, isNonXPHistoryItem } from '@core/common';
import {
  useAccountsContext,
  useNetworkContext,
  useWalletContext,
} from '@core/ui';
import { useEffect, useState } from 'react';
import { useIdentifyAddress } from './useIdentifyAddress';
import { getAddressForNetwork } from '../utils/getAddressForNetwork';
import { TransactionType } from '@avalabs/vm-module-types';

//Some known addresses that are not contacts
const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';
const ETHER_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' as const;
const VELORA_ADDRESS = '0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57' as const;

const addressesToFilter = [
  ETHEREUM_ADDRESS,
  BURN_ADDRESS,
  ETHER_ADDRESS,
  VELORA_ADDRESS,
];

export const useRecentRecipients = () => {
  const { network } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { getTransactionHistory } = useWalletContext();
  const identifyAddress = useIdentifyAddress();

  const [historyContacts, setHistoryContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (!network) {
      setHistoryContacts([]);
      return;
    }

    getTransactionHistory().then((history) => {
      const filteredHistory = history
        .filter(
          (tx) =>
            tx.txType === TransactionType.SEND ||
            tx.txType === TransactionType.NFT_SEND,
        )
        .filter((tx, index, self) => {
          if (!tx.isSender || (isNonXPHistoryItem(tx) && tx.isContractCall)) {
            return false;
          }
          // filter out dupe to addresses
          return (
            index === self.findIndex((temp) => temp.to === tx.to) &&
            !addressesToFilter.includes(tx.to)
          );
        });

      const contactHistory = filteredHistory.reduce((acc, tx) => {
        const addressIdentities = [identifyAddress(tx.to)];

        addressIdentities.forEach((identity) => {
          const addressToCheck = getAddressForNetwork(network, identity);

          const userAddress = getAddressForNetwork(network, activeAccount);

          const addressesInList = acc.map((value) =>
            getAddressForNetwork(network, value),
          );
          if (
            userAddress !== addressToCheck &&
            !addressesInList.includes(addressToCheck)
          ) {
            acc.push(identity);
          }
        });

        return acc;
      }, [] as Contact[]);

      setHistoryContacts(contactHistory);
    });
  }, [network, activeAccount, getTransactionHistory, identifyAddress]);

  return { recentRecipients: historyContacts };
};
