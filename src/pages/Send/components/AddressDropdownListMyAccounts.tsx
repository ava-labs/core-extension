import {
  Box,
  Button,
  Scrollbars,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import type { Contact } from '@avalabs/types';

import { AddressDropdownListItem } from './AddressDropdownListItem';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPages } from '@src/components/settings/models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { isBitcoin } from '@src/utils/isBitcoin';
import { WalletId } from '@src/background/services/accounts/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { isPchainNetwork } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
import { useMemo } from 'react';
import { isXchainNetwork } from '@src/background/services/network/utils/isAvalancheXchainNetwork';
import { isSolanaNetwork } from '@src/background/services/network/utils/isSolanaNetwork';

export type MyAccountContact = {
  id: string;
  address: string;
  addressBTC: string;
  addressXP: string;
  name: string;
  isKnown: boolean;
};

export type MyAccountContacts = Record<
  WalletId | 'imported',
  MyAccountContact[]
>;

type AddressDropdownListMyAccountsProps = {
  contacts: MyAccountContacts;
  selectedContact?: Contact;
  onChange(contact: Contact): void;
  addContact?: boolean;
};

export const AddressDropdownListMyAccounts = ({
  contacts,
  selectedContact,
  onChange,
  addContact,
}: AddressDropdownListMyAccountsProps) => {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const useBtcAddress = isBitcoin(network);
  const useSvmAddress = network && isSolanaNetwork(network);
  const { wallets } = useWalletContext();

  const useXpAddress = useMemo(() => {
    return isPchainNetwork(network) || isXchainNetwork(network);
  }, [network]);

  const addressType = useSvmAddress
    ? 'addressSVM'
    : useBtcAddress
      ? 'addressBTC'
      : useXpAddress
        ? 'addressXP'
        : 'address';
  const selectedAddress = selectedContact?.[addressType]?.toLowerCase();

  const { setIsSettingsOpen, setSettingsActivePage } = useSettingsContext();
  return (
    <Stack sx={{ flexGrow: 1 }}>
      {addContact && (
        <Box sx={{ py: 2 }}>
          <Button
            variant="text"
            onClick={() => {
              setSettingsActivePage(SettingsPages.ADD_CONTACT);
              setIsSettingsOpen(true);
            }}
            data-testid="send-add-new-contact"
          >
            {t('+ Add New Contact')}
          </Button>
        </Box>
      )}
      <Scrollbars style={{ flexGrow: 1, height: '100%', width: '100%' }}>
        {wallets.map(({ id, name: walletName }) => {
          const walletAccounts = contacts[id];
          if (walletAccounts && walletAccounts.length) {
            return (
              <Stack key={id}>
                <Typography variant="button">{walletName}</Typography>

                {walletAccounts.map((contact, i) => (
                  <AddressDropdownListItem
                    key={`${contact.address}${i}`}
                    contact={contact}
                    isSelected={
                      contact?.[addressType]?.toLowerCase() === selectedAddress
                    }
                    onChange={onChange}
                  />
                ))}
              </Stack>
            );
          }
        })}
        {contacts.imported && Object.values(contacts.imported).length > 0 && (
          <Typography variant="button">{t('Imported')}</Typography>
        )}
        {contacts.imported &&
          Object.values(contacts.imported).map((acc) => (
            <AddressDropdownListItem
              key={`${acc.id}`}
              contact={acc}
              isSelected={acc?.[addressType]?.toLowerCase() === selectedAddress}
              onChange={onChange}
            />
          ))}
      </Scrollbars>
    </Stack>
  );
};
