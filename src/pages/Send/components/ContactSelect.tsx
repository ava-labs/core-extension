import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { AddressDropdownList } from './AddressDropdownList';
import { Contact } from '@src/background/services/contacts/models';
import { useIdentifyAddress } from '../hooks/useIdentifyAddress';

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

type ContactSelectProps = {
  selectedContact?: Contact;
  onChange(contact: Contact): void;
};

export const ContactSelect = ({
  onChange,
  selectedContact,
}: ContactSelectProps) => {
  const identifyAddress = useIdentifyAddress();
  const { recentTxHistory } = useWalletContext();
  const { accounts } = useAccountsContext();
  const { contacts } = useContactsContext();
  const [selectedTab, setSelectedTab] = useState<string>('recents');

  const formattedTxHistory = useMemo(
    () =>
      recentTxHistory
        // filter out dupe to addresses
        .filter(
          (tx, index, self) =>
            index === self.findIndex((temp) => temp.to === tx.to)
        )
        .map((tx) => identifyAddress(tx.to)),
    [recentTxHistory, identifyAddress]
  );

  const formattedAccounts = useMemo(
    () =>
      accounts.map(({ addressC, name }) => ({
        id: '',
        address: addressC,
        name,
        isKnown: true,
      })),
    [accounts]
  );

  const formattedContacts = useMemo(
    () => contacts.map((contact) => ({ ...contact, isKnown: true })),
    [contacts]
  );

  return (
    <VerticalFlex margin="24px 0 0 0" grow="1">
      <Tabs justify="center" padding="0 16px 0 16px">
        <Tab
          selected={selectedTab === 'recents'}
          onClick={() => setSelectedTab('recents')}
        >
          <TabText $selected={selectedTab === 'recents'}>Recents</TabText>
        </Tab>
        <Tab
          selected={selectedTab === 'addressBook'}
          onClick={() => setSelectedTab('addressBook')}
        >
          <TabText $selected={selectedTab === 'addressBook'}>
            Address Book
          </TabText>
        </Tab>
        <Tab
          selected={selectedTab === 'accounts'}
          onClick={() => setSelectedTab('accounts')}
        >
          <TabText $selected={selectedTab === 'accounts'}>My Accounts</TabText>
        </Tab>
      </Tabs>
      {selectedTab === 'recents' && (
        <AddressDropdownList
          contacts={formattedTxHistory}
          selectedContact={selectedContact}
          onChange={onChange}
        />
      )}
      {selectedTab === 'addressBook' && (
        <AddressDropdownList
          contacts={formattedContacts}
          onChange={onChange}
          selectedContact={selectedContact}
        />
      )}
      {selectedTab === 'accounts' && (
        <AddressDropdownList
          contacts={formattedAccounts}
          onChange={onChange}
          selectedContact={selectedContact}
        />
      )}
    </VerticalFlex>
  );
};
