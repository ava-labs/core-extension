import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { Box, Stack, Tab, TabPanel, Tabs } from '@avalabs/core-k2-components';
import type { Contact } from '@avalabs/types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccountsContext } from '@core/ui';
import { useContactsContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import {
  isPchainNetwork,
  isSolanaNetwork,
  isXchainNetwork,
  stripAddressPrefix,
} from '@core/common';
import { AddressDropdownList } from './AddressDropdownList';
import {
  AddressDropdownListMyAccounts,
  MyAccountContacts,
} from './AddressDropdownListMyAccounts';

interface ContactSelectProps {
  selectedContact?: Contact;
  onChange(contact: Contact, selectedTab: string): void;
}

enum TabId {
  ADDRESS_BOOK,
  // RECENT_ADDRESSES, Hiding recents for now
  MY_ACCOUNTS,
}

// const NoContactsMessage = ({ header, description }) => (
//   <Stack sx={{ pt: 12, gap: 1, textAlign: 'center', width: '100%' }}>
//     <Typography variant="h4" color="text.primary">
//       {header}
//     </Typography>
//     <Typography variant="body2" color="text.secondary">
//       {description}
//     </Typography>
//   </Stack>
// );

export const ContactSelect = ({
  onChange,
  selectedContact,
}: ContactSelectProps) => {
  const { t } = useTranslation();
  const {
    accounts: { imported: importedAccounts, primary: primaryAccounts },
  } = useAccountsContext();
  const { contacts } = useContactsContext();
  const { network } = useNetworkContext();
  const [selectedTab, setSelectedTab] = useState(TabId.ADDRESS_BOOK);
  // const { recentRecipients } = useRecentRecipients();

  const formattedAccounts = useMemo(() => {
    const formattedPrimary: MyAccountContacts = {};

    Object.keys(primaryAccounts).forEach((walletId) => {
      const walletAccount = primaryAccounts[walletId];
      if (!walletAccount || !walletAccount.length) {
        return;
      }
      const result = walletAccount.map(
        ({
          id,
          addressC,
          name,
          addressBTC,
          addressPVM,
          addressAVM,
          addressSVM,
        }) => ({
          id,
          address: network?.vmName == NetworkVMType.EVM ? addressC : '',
          addressBTC:
            network?.vmName === NetworkVMType.BITCOIN ? addressBTC : '',
          addressXP:
            isPchainNetwork(network) && addressPVM
              ? stripAddressPrefix(addressPVM)
              : isXchainNetwork(network) && addressAVM
                ? stripAddressPrefix(addressAVM)
                : '',
          addressSVM: network && isSolanaNetwork(network) ? addressSVM : '',
          name,
          isKnown: true,
        }),
      );
      formattedPrimary[walletId] = result;
    });

    const importedAccountToPrep = Object.values(importedAccounts);
    if (!importedAccountToPrep.length) {
      return formattedPrimary;
    }

    const formattedImported = importedAccountToPrep?.map(
      ({
        id,
        addressC,
        name,
        addressBTC,
        addressPVM,
        addressAVM,
        addressSVM,
      }) => ({
        id,
        address: network?.vmName == NetworkVMType.EVM ? addressC : '',
        addressBTC:
          network?.vmName === NetworkVMType.BITCOIN && addressBTC
            ? addressBTC
            : '',
        addressXP:
          isPchainNetwork(network) && addressPVM
            ? stripAddressPrefix(addressPVM)
            : isXchainNetwork(network) && addressAVM
              ? stripAddressPrefix(addressAVM)
              : '',
        addressSVM: network && isSolanaNetwork(network) ? addressSVM : '',
        name,
        isKnown: true,
      }),
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
        if (isPchainNetwork(network) || isXchainNetwork(network)) {
          return contact.addressXP;
        }
        if (isSolanaNetwork(network)) {
          return contact.addressSVM;
        }
      })
      .map((contact) => ({
        ...contact,
        address: network?.vmName == NetworkVMType.EVM ? contact.address : '',
        addressBTC:
          network?.vmName === NetworkVMType.BITCOIN ? contact.addressBTC : '',
        addressPVM: isPchainNetwork(network) ? contact.addressXP : '',
        addressAVM: isXchainNetwork(network) ? contact.addressXP : '',
        addressSVM:
          network && isSolanaNetwork(network) ? contact.addressSVM : '',
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
        {/* 
				Hiding Recents tab for now

				<Tab
          value={TabId.RECENT_ADDRESSES}
          data-testid="send-recent-contact-tab"
          tabIndex={1}
          label={t('Recents')}
        />
      */}
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
        {/* <TabPanel
          value={selectedTab}
          index={TabId.RECENT_ADDRESSES}
          sx={{
            display: 'flex',
            height: selectedTab === TabId.RECENT_ADDRESSES ? '100%' : 0,
          }}
        >
          {recentRecipients.length > 0 ? (
            <AddressDropdownList
              contacts={recentRecipients}
              selectedContact={selectedContact}
              onChange={(contact) => onChange(contact, 'recents')}
            />
          ) : (
            <NoContactsMessage
              header={t('No Recent Recipients')}
              description={t('Enter the address in the above field')}
            />
          )}
        </TabPanel> */}
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
