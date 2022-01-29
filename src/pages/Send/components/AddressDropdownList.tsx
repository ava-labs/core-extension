import { HorizontalSeparator, VerticalFlex } from '@avalabs/react-components';
import { AddressDropdownListItem } from './AddressDropdownListItem';
import { Contact } from '@src/background/services/contacts/models';
import Scrollbars from 'react-custom-scrollbars';

type AddressDropdownListProps = {
  contacts: Contact[];
  onChange(contact: Contact): void;
};

export const AddressDropdownList = ({
  contacts,
  onChange,
}: AddressDropdownListProps) => {
  return (
    <VerticalFlex grow="1">
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
            onChange={onChange}
          />
        ))}
      </Scrollbars>
      <HorizontalSeparator margin="0" />
    </VerticalFlex>
  );
};
