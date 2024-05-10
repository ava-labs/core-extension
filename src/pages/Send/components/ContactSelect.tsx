import { useEffect, useMemo, useState } from 'react';
import type { Contact } from '@avalabs/types';
import { NetworkVMType } from '@avalabs/chains-sdk';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  Typography,
} from '@avalabs/k2-components';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { AddressDropdownList } from './AddressDropdownList';
import { useIdentifyAddress } from '../hooks/useIdentifyAddress';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  AddressDropdownListMyAccounts,
  MyAccountContacts,
} from './AddressDropdownListMyAccounts';
import { isPchainNetwork } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
import { isTxHistoryItem } from '@src/background/services/history/utils/isTxHistoryItem';
import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';
import { indexOf } from 'lodash';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';

interface ContactSelectProps {
  selectedContact?: Contact;
  onChange(contact: Contact, selectedTab: string): void;
}

enum TabId {
  ADDRESS_BOOK,
  RECENT_ADDRESSES,
  MY_ACCOUNTS,
}

const NoContactsMessage = ({ header, description }) => (
  <Stack sx={{ pt: 12, gap: 1, textAlign: 'center', width: '100%' }}>
    <Typography variant="h4" color="text.primary">
      {header}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Stack>
);

export const ContactSelect = ({
  onChange,
  selectedContact,
}: ContactSelectProps) => {
  const { t } = useTranslation();
  const identifyAddress = useIdentifyAddress();
  const { getTransactionHistory } = useWalletContext();
  const {
    accounts: {
      imported: importedAccounts,
      primary: primaryAccounts,
      active: activeAccount,
    },
  } = useAccountsContext();
  const { contacts } = useContactsContext();
  const { network } = useNetworkContext();
  const [selectedTab, setSelectedTab] = useState(TabId.ADDRESS_BOOK);
  const [historyContacts, setHistoryContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (!network) {
      return;
    }
    getTransactionHistory().then((history) => {
      const filteredHistory = history.filter((tx, index, self) => {
        if (!tx.isSender || (isTxHistoryItem(tx) && tx.isContractCall)) {
          return false;
        }
        // filter out dupe to addresses
        return (
          index === self.findIndex((temp) => temp.to === tx.to) &&
          tx.to !== '0x0000000000000000000000000000000000000000'
        );
      });

      const contactHistory = filteredHistory.reduce((acc, tx) => {
        if (isTxHistoryItem(tx)) {
          const identifiedContact = identifyAddress(tx.to);
          if (indexOf(acc, identifiedContact) === -1)
            acc.push(identifyAddress(tx.to));
          return acc;
        }

        const addressIdentities = tx.to.map((toAddress) =>
          identifyAddress(toAddress)
        );
        addressIdentities.forEach((identity) => {
          const addressToCheck = isBitcoinNetwork(network)
            ? identity.addressBTC
            : isPchainNetwork(network)
            ? identity.addressXP
            : identity.address;

          const userAddress = isBitcoinNetwork(network)
            ? activeAccount?.addressBTC
            : isPchainNetwork(network)
            ? activeAccount?.addressPVM
              ? stripAddressPrefix(activeAccount?.addressPVM)
              : ''
            : activeAccount?.addressC;

          const addressesInList = acc.map((value) =>
            isBitcoinNetwork(network)
              ? value.addressBTC
              : isPchainNetwork(network)
              ? value.addressXP
              : value.address
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
  }, [
    activeAccount?.addressBTC,
    activeAccount?.addressC,
    activeAccount?.addressPVM,
    getTransactionHistory,
    identifyAddress,
    network,
  ]);

  const formattedAccounts = useMemo(() => {
    const formattedPrimary: MyAccountContacts = {};

    Object.keys(primaryAccounts).forEach((walletId) => {
      const walletAccount = primaryAccounts[walletId];
      if (!walletAccount || !walletAccount.length) {
        return;
      }
      const result = walletAccount.map(
        ({ addressC, name, addressBTC, addressPVM }) => ({
          id: '',
          address: network?.vmName == NetworkVMType.EVM ? addressC : '',
          addressBTC:
            network?.vmName === NetworkVMType.BITCOIN ? addressBTC : '',
          addressXP:
            isPchainNetwork(network) && addressPVM
              ? stripAddressPrefix(addressPVM)
              : '',
          name,
          isKnown: true,
        })
      );
      formattedPrimary[walletId] = result;
    });

    const importedAccountToPrep = Object.values(importedAccounts);
    if (!importedAccountToPrep.length) {
      return formattedPrimary;
    }

    const formattedImported = importedAccountToPrep?.map(
      ({ addressC, name, addressBTC, addressPVM }) => ({
        id: '',
        address: network?.vmName == NetworkVMType.EVM ? addressC : '',
        addressBTC:
          network?.vmName === NetworkVMType.BITCOIN && addressBTC
            ? addressBTC
            : '',
        addressXP:
          isPchainNetwork(network) && addressPVM
            ? stripAddressPrefix(addressPVM)
            : '',
        name,
        isKnown: true,
      })
    );

    return {
      ...formattedPrimary,
      ...(formattedImported.length ? { imported: formattedImported } : {}),
    };
  }, [importedAccounts, network, primaryAccounts]);

  const formattedContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        if (network?.vmName === NetworkVMType.EVM) {
          return contact.address;
        }
        if (network?.vmName === NetworkVMType.BITCOIN) {
          return contact.addressBTC;
        }
        if (isPchainNetwork(network)) {
          return contact.addressXP;
        }
      })
      .map((contact) => ({
        ...contact,
        address: network?.vmName == NetworkVMType.EVM ? contact.address : '',
        addressBTC:
          network?.vmName === NetworkVMType.BITCOIN ? contact.addressBTC : '',
        addressPVM: isPchainNetwork(network) ? contact.addressXP : '',
        isKnown: true,
      }));
  }, [contacts, network]);

  return (
    <Stack sx={{ width: '100%', px: 2, pt: 3, height: '100%' }}>
      <Tabs
        variant="fullWidth"
        indicatorColor="secondary"
        value={selectedTab}
        onChange={(_, tab) => setSelectedTab(tab)}
        sx={{ flexShrink: 0 }}
      >
        <Tab
          value={TabId.ADDRESS_BOOK}
          data-testid="send-address-book-tab"
          tabIndex={0}
          label={t('Address Book')}
        />
        <Tab
          value={TabId.RECENT_ADDRESSES}
          data-testid="send-recent-contact-tab"
          tabIndex={1}
          label={t('Recents')}
        />
        <Tab
          value={TabId.MY_ACCOUNTS}
          data-testid="send-my-accounts-tab"
          tabIndex={2}
          label={t('My Accounts')}
        />
      </Tabs>
      <Box
        sx={{
          width: '100%',
          borderTop: 1,
          borderColor: 'divider',
          mt: -0.25, // Move the container up, just below the tab indicator.
          pt: 0.75, // Then add some padding at the top to equalize the missed space.
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        <TabPanel
          value={selectedTab}
          index={TabId.ADDRESS_BOOK}
          sx={{
            display: 'flex',
            height: selectedTab === TabId.ADDRESS_BOOK ? '100%' : 0,
          }}
        >
          <AddressDropdownList
            contacts={formattedContacts}
            onChange={(contact) => onChange(contact, 'addressBook')}
            selectedContact={selectedContact}
            addContact
          />
        </TabPanel>
        <TabPanel
          value={selectedTab}
          index={TabId.RECENT_ADDRESSES}
          sx={{
            display: 'flex',
            height: selectedTab === TabId.RECENT_ADDRESSES ? '100%' : 0,
          }}
        >
          {historyContacts.length > 0 ? (
            <AddressDropdownList
              contacts={historyContacts}
              selectedContact={selectedContact}
              onChange={(contact) => onChange(contact, 'recents')}
            />
          ) : (
            <NoContactsMessage
              header={t('No Recent Recipients')}
              description={t('Enter the address in the above field')}
            />
          )}
        </TabPanel>
        <TabPanel
          value={selectedTab}
          index={TabId.MY_ACCOUNTS}
          sx={{
            display: 'flex',
            height: selectedTab === TabId.MY_ACCOUNTS ? '100%' : 0,
          }}
        >
          <AddressDropdownListMyAccounts
            contacts={formattedAccounts}
            onChange={(contact) => onChange(contact, 'accounts')}
            selectedContact={selectedContact}
          />
        </TabPanel>
      </Box>
    </Stack>
  );
};
