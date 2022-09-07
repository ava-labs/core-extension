import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AddressDropdownList } from './AddressDropdownList';
import type { Contact } from '@avalabs/types';
import { useIdentifyAddress } from '../hooks/useIdentifyAddress';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkVMType } from '@avalabs/chains-sdk';

const Tabs = styled(HorizontalFlex)`
  border-bottom: ${({ theme }) => `1px solid ${theme.separator.color}`};
`;

const TabText = styled(Typography)<{
  $selected: boolean;
}>`
  text-align: center;
  width: 100%;
  font-size: 14px;
  ${({ $selected, theme }) => `
		color: ${$selected ? theme.colors.text1 : theme.colors.text2};
		font-weight: ${$selected ? 500 : 400};
	`}
`;

const Tab = styled(HorizontalFlex)<{ selected?: boolean }>`
  border: none;
  background: transparent;
  justify-content: center;
  cursor: pointer;
  padding: 8px 0;
  width: 100%; // To stop shifting due to font-weight change when switching tabs
  border-bottom: ${({ selected, theme }) =>
    selected ? `2px solid ${theme.colors.text1}` : '2px solid transparent'}; ;
`;

interface ContactSelectProps {
  selectedContact?: Contact;
  onChange(contact: Contact, selectedTab: string): void;
}

export const ContactSelect = ({
  onChange,
  selectedContact,
}: ContactSelectProps) => {
  const identifyAddress = useIdentifyAddress();
  const { getTransactionHistory } = useWalletContext();
  const { accounts } = useAccountsContext();
  const { contacts } = useContactsContext();
  const { network } = useNetworkContext();
  const [selectedTab, setSelectedTab] = useState<string>('recents');
  const [historyContacts, setHistoryContacts] = useState<Contact[]>([]);

  useEffect(() => {
    getTransactionHistory().then((history) =>
      setHistoryContacts(
        history
          .filter((tx, index, self) => {
            if (!tx.isSender || tx.isContractCall) {
              return false;
            }
            // filter out dupe to addresses
            return (
              index === self.findIndex((temp) => temp.to === tx.to) &&
              tx.to !== '0x0000000000000000000000000000000000000000'
            );
          })
          .map((tx) => identifyAddress(tx.to))
      )
    );
  }, [getTransactionHistory, identifyAddress]);

  const formattedAccounts = useMemo(() => {
    return accounts.map(({ addressC, name, addressBTC }) => ({
      id: '',
      address: network?.vmName == NetworkVMType.EVM ? addressC : '',
      addressBTC: network?.vmName === NetworkVMType.BITCOIN ? addressBTC : '',
      name,
      isKnown: true,
    }));
  }, [accounts, network]);

  const formattedContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        if (network?.vmName === NetworkVMType.EVM) {
          return contact.address;
        }
        if (network?.vmName === NetworkVMType.BITCOIN) {
          return contact.addressBTC;
        }
      })
      .map((contact) => ({
        ...contact,
        address: network?.vmName == NetworkVMType.EVM ? contact.address : '',
        addressBTC:
          network?.vmName === NetworkVMType.BITCOIN ? contact.addressBTC : '',
        isKnown: true,
      }));
  }, [contacts, network]);

  return (
    <VerticalFlex margin="24px 0 0 0" grow="1">
      <Tabs justify="center" padding="0 16px 0 16px">
        <Tab
          data-testid="send-recent-contact-tab"
          selected={selectedTab === 'recents'}
          onClick={() => setSelectedTab('recents')}
        >
          <TabText $selected={selectedTab === 'recents'}>Recents</TabText>
        </Tab>
        <Tab
          data-testid="send-address-book-tab"
          selected={selectedTab === 'addressBook'}
          onClick={() => setSelectedTab('addressBook')}
        >
          <TabText $selected={selectedTab === 'addressBook'}>
            Address Book
          </TabText>
        </Tab>
        <Tab
          data-testid="send-my-accounts-tab"
          selected={selectedTab === 'accounts'}
          onClick={() => setSelectedTab('accounts')}
        >
          <TabText $selected={selectedTab === 'accounts'}>My Accounts</TabText>
        </Tab>
      </Tabs>
      {selectedTab === 'recents' && (
        <AddressDropdownList
          contacts={historyContacts}
          selectedContact={selectedContact}
          onChange={(contact) => onChange(contact, selectedTab)}
        />
      )}
      {selectedTab === 'addressBook' && (
        <AddressDropdownList
          contacts={formattedContacts}
          onChange={(contact) => onChange(contact, selectedTab)}
          selectedContact={selectedContact}
        />
      )}
      {selectedTab === 'accounts' && (
        <AddressDropdownList
          contacts={formattedAccounts}
          onChange={(contact) => onChange(contact, selectedTab)}
          selectedContact={selectedContact}
        />
      )}
    </VerticalFlex>
  );
};
