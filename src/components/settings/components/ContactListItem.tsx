import {
  AvaxTokenIcon,
  HorizontalFlex,
  HorizontalSeparator,
  SecondaryDropDownMenuItem,
  SimpleAddress,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled from 'styled-components';
import type { Contact } from '@avalabs/types';
import { SettingsPages } from '../models';
import { useHistory, useLocation } from 'react-router-dom';
import { BitcoinLogo } from '@src/components/icons/BitcoinLogo';

interface ContactListItemProps {
  contact: Contact;
  navigateTo: (page: SettingsPages) => void;
  index: number;
  length: number;
}

const ContactName = styled(Typography)`
  max-width: 95%;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

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

const StyledAvaxIcon = styled(AvaxTokenIcon)`
  margin: 0 4px 0 0;
`;

const StyleBitcoinIcon = styled(BitcoinLogo)`
  margin: 0 4px 0 0;
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
          <HorizontalFlex justify="space-between" width={'100%'} align="center">
            <ContactName title={contact.name}>{contact.name}</ContactName>
            <VerticalFlex>
              {contact.address && (
                <HorizontalFlex data-testid="contact-li-copy-ava-address" align="center">
                  <StyledAvaxIcon height="16px" />
                  <SimpleAddress address={contact.address} />
                </HorizontalFlex>
              )}
              {contact.addressBTC && (
                <HorizontalFlex data-testid="contact-li-copy-btc-address" align="center">
                  <StyleBitcoinIcon height="16px" />
                  <SimpleAddress address={contact.addressBTC} />
                </HorizontalFlex>
              )}
            </VerticalFlex>
          </HorizontalFlex>
        </VerticalFlex>
      </StyledSecondaryDropDownMenuItem>
      {!(length - 1 === index) && <StyledHR />}
    </>
  );
};
