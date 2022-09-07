import {
  HorizontalSeparator,
  SecondaryDropDownMenuItem,
  VerticalFlex,
} from '@avalabs/react-components';
import styled from 'styled-components';
import type { Contact } from '@avalabs/types';
import { SettingsPages } from '../models';
import { useHistory, useLocation } from 'react-router-dom';
import { ContactInfo } from './ContactInfo';

interface ContactListItemProps {
  contact: Contact;
  navigateTo: (page: SettingsPages) => void;
  index: number;
  length: number;
}

const StyledHR = styled(HorizontalSeparator)`
  margin: 0 16px;
  width: auto;
`;

const StyledSecondaryDropDownMenuItem = styled(SecondaryDropDownMenuItem)`
  box-sizing: border-box;

  :hover {
    border-top: 1px solid ${({ theme }) => `${theme.colors.bg3}`};
    margin-bottom: 1px;
    margin-top: -1px;
  }

  :hover + ${StyledHR} {
    visibility: hidden;
  }
`;

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
      <StyledSecondaryDropDownMenuItem
        data-testid={`contact-li-${index}`}
        height="64px"
        justify="space-between"
        align="center"
        padding="0 16px"
        onClick={() => {
          history.push({
            pathname: pathname,
            search: `?${new URLSearchParams({
              contactId: contact.id,
            }).toString()}`,
          });
          navigateTo && navigateTo(SettingsPages.CONTACT_PROFILE);
        }}
      >
        <VerticalFlex align="flex-start" justify="space-between" width="100%">
          <ContactInfo contact={contact} />
        </VerticalFlex>
      </StyledSecondaryDropDownMenuItem>
      {!(length - 1 === index) && <StyledHR />}
    </>
  );
};
