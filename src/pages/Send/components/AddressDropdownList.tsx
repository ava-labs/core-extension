import { TextButton, VerticalFlex } from '@avalabs/react-components';
import { AddressDropdownListItem } from './AddressDropdownListItem';
import type { Contact } from '@avalabs/types';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPages } from '@src/components/settings/models';

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
  const { setIsSettingsOpen, setSettingsActivePage } = useSettingsContext();
  return (
    <VerticalFlex grow="1" paddingTop={addContact ? '0' : '16px'}>
      {addContact && (
        <TextButton
          padding="18px"
          onClick={() => {
            setSettingsActivePage(SettingsPages.ADD_CONTACT);
            setIsSettingsOpen(true);
          }}
          data-testid="send-add-new-contact"
        >
          {t('+ Add New Contact')}
        </TextButton>
      )}
      <Scrollbars
        style={{
          flexGrow: 1,
          height: '100%',
          width: '100%',
        }}
      >
        {contacts.map((contact, i) => (
          <AddressDropdownListItem
            key={`${contact.address}${i}`}
            contact={contact}
            selectedContact={selectedContact}
            onChange={onChange}
          />
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
};
