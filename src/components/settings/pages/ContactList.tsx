import { useState } from 'react';
import {
  PlusIcon,
  SearchInput,
  TextButton,
  Typography,
  VerticalFlex,
  Tooltip,
  toast,
  useDialog,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { ContactListItem } from '../components/ContactListItem';
import { Contact } from '@src/background/services/contacts/models';

export function ContactList({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { contacts, createContact, removeContact } = useContactsContext();
  const [editingId, setEditingId] = useState('');
  const [editedContactData, setEditedContactData] = useState<Contact>();
  const { showDialog, clearDialog } = useDialog();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredContacts = contacts
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) // sort alphabetically
    .filter(
      (c) =>
        !searchTerm ||
        c.address.toLowerCase().includes(searchTerm) ||
        c.name.toLowerCase().includes(searchTerm)
    );

  const editContact = (e: React.MouseEvent, contact) => {
    e.stopPropagation();
    setEditingId(contact.id);
    setEditedContactData(contact);
  };

  const onSaveContact = async (e: React.UIEvent, newContact: Contact) => {
    e.stopPropagation();
    if (!editedContactData) {
      return;
    }
    await removeContact(editedContactData);
    await createContact(newContact);
    setEditingId('');
    setEditedContactData(undefined);
    toast.success('Contact updated!');
  };

  const onDelete = () => {
    editedContactData &&
      showDialog({
        title: 'Delete Contact?',
        body: 'Are you sure you want to delete this contact?',
        confirmText: 'Delete',
        width: '343px',
        onConfirm: async () => {
          clearDialog();
          await removeContact(editedContactData);
          toast.success('Contact deleted!');
        },
        cancelText: 'Cancel',
        onCancel: () => {
          clearDialog();
          setEditingId('');
        },
      });
  };

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Address book'}
        action={
          <Tooltip content={<Typography size={12}>Add New Contact</Typography>}>
            <TextButton onClick={() => navigateTo(SettingsPages.ADD_CONTACT)}>
              <PlusIcon height="18px" color={theme.colors.text1} />
            </TextButton>
          </Tooltip>
        }
      />
      <VerticalFlex padding="16px">
        <SearchInput
          placeholder="Search"
          onSearch={setSearchTerm}
          autoFocus={true}
        />
      </VerticalFlex>
      <Scrollbars>
        {filteredContacts.length === 0 && (
          <Typography margin="16px" size={14} as="p" align="center">
            No contacts found
          </Typography>
        )}
        {filteredContacts.map((contact) => (
          <ContactListItem
            key={contact.id}
            contact={contact}
            onEdit={editContact}
            isEditing={editingId === contact.id}
            onSave={onSaveContact}
            onDelete={onDelete}
          />
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
