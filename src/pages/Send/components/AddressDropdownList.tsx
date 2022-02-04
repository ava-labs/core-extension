import { VerticalFlex } from '@avalabs/react-components';
import { AddressDropdownListItem } from './AddressDropdownListItem';
import { Contact } from '@src/background/services/contacts/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';

type AddressDropdownListProps = {
  contacts: Contact[];
  selectedContact?: Contact;
  onChange(contact: Contact): void;
};

export const AddressDropdownList = ({
  contacts,
  selectedContact,
  onChange,
}: AddressDropdownListProps) => {
  return (
    <VerticalFlex grow="1" paddingTop="16px">
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
