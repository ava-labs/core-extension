import { Box, Button, Scrollbars, Stack } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import type { Contact } from '@avalabs/types';

import { AddressDropdownListItem } from './AddressDropdownListItem';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPages } from '@src/components/settings/models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { isBitcoin } from '@src/utils/isBitcoin';
import { isPchainNetwork } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
import { isXchainNetwork } from '@src/background/services/network/utils/isAvalancheXchainNetwork';

type AddressDropdownListProps = {
  contacts: Contact[];
  selectedContact?: Contact;
  onChange(contact: Contact): void;
  addContact?: boolean;
};

export const AddressDropdownList = ({
  contacts,
  selectedContact,
  onChange,
  addContact,
}: AddressDropdownListProps) => {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const useBtcAddress = isBitcoin(network);
  const useXPAddress = isPchainNetwork(network) || isXchainNetwork(network);

  const selectedAddress =
    selectedContact?.[
      useBtcAddress ? 'addressBTC' : useXPAddress ? 'addressXP' : 'address'
    ]?.toLowerCase();

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
        {contacts.map((contact, i) => (
          <AddressDropdownListItem
            key={`${contact.address}${i}`}
            contact={contact}
            isSelected={
              contact?.[
                useBtcAddress
                  ? 'addressBTC'
                  : useXPAddress
                  ? 'addressXP'
                  : 'address'
              ]?.toLowerCase() === selectedAddress
            }
            onChange={onChange}
          />
        ))}
      </Scrollbars>
    </Stack>
  );
};
