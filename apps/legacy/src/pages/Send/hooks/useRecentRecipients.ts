import { Contact } from '@avalabs/types';
import {
  BURN_ADDRESS,
  ETHEREUM_ADDRESS,
  ETHER_ADDRESS,
  VELORA_ADDRESS,
  isBitcoinNetwork,
  isNonXPHistoryItem,
  isPchainNetwork,
  isSolanaNetwork,
  isXchainNetwork,
  stripAddressPrefix,
} from '@core/common';
import {
  useAccountsContext,
  useNetworkContext,
  useWalletContext,
} from '@core/ui';
import { useEffect, useState } from 'react';
import { useIdentifyAddress } from './useIdentifyAddress';
import { indexOf } from 'lodash';

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
      const filteredHistory = history.filter((tx, index, self) => {
        if (!tx.isSender || (isNonXPHistoryItem(tx) && tx.isContractCall)) {
          return false;
        }
        // filter out dupe to addresses
        return (
          index === self.findIndex((temp) => temp.to === tx.to) &&
          tx.to !== ETHEREUM_ADDRESS &&
          tx.to !== BURN_ADDRESS &&
          tx.to !== ETHER_ADDRESS &&
          tx.to !== VELORA_ADDRESS
        );
      });

      const contactHistory = filteredHistory.reduce((acc, tx) => {
        const addressIdentities = [identifyAddress(tx.to)];

        addressIdentities.forEach((identity) => {
          const addressToCheck = isBitcoinNetwork(network)
            ? identity.addressBTC
            : isPchainNetwork(network) || isXchainNetwork(network)
              ? identity.addressXP
                ? isSolanaNetwork(network)
                : identity.addressSVM
              : identity.address;

          const userAddress = isBitcoinNetwork(network)
            ? activeAccount?.addressBTC
            : isPchainNetwork(network)
              ? stripAddressPrefix(activeAccount?.addressPVM ?? '')
              : isXchainNetwork(network)
                ? stripAddressPrefix(activeAccount?.addressAVM ?? '')
                : isSolanaNetwork(network)
                  ? activeAccount?.addressSVM
                  : activeAccount?.addressC;

          const addressesInList = acc.map((value) =>
            isBitcoinNetwork(network)
              ? value.addressBTC
              : isPchainNetwork(network) || isXchainNetwork(network)
                ? value.addressXP
                : isSolanaNetwork(network)
                  ? value.addressSVM
                  : value.address,
          );
          if (
            indexOf(addressesInList, addressToCheck) === -1 &&
            userAddress !== addressToCheck
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
