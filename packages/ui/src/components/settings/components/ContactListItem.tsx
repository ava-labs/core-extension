import type { Contact } from '@avalabs/types';
import { SettingsPages } from '../models';
import { useHistory, useLocation } from 'react-router-dom';
import { ContactInfo } from './ContactInfo';
import { Divider, ListItem, ListItemButton } from '@avalabs/core-k2-components';

interface ContactListItemProps {
  contact: Contact;
  navigateTo: (page: SettingsPages) => void;
  index: number;
  length: number;
}

export const ContactListItem = ({
  contact,
  navigateTo,
  index,
  length,
}: ContactListItemProps) => {
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <>
      <ListItem
        data-testid={`contact-li-${index}`}
        onClick={() => {
          history.push({
            pathname: pathname,
            search: `?${new URLSearchParams({
              contactId: contact.id,
            }).toString()}`,
          });
          if (!navigateTo) {
            return;
          }
          navigateTo(SettingsPages.CONTACT_PROFILE);
        }}
        sx={{ p: 0 }}
      >
        <ListItemButton
          sx={{
            minHeight: '68px',
            py: 1.25,
            px: 2,
            m: 0,
            '&:hover': { borderRadius: 0 },
          }}
        >
          <ContactInfo contact={contact} />
        </ListItemButton>
      </ListItem>
      {!(length - 1 === index) && <Divider />}
    </>
  );
};
