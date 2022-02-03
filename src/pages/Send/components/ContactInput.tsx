import {
  Input,
  ContactsIcon,
  HorizontalFlex,
  CaretIcon,
  IconDirection,
} from '@avalabs/react-components';
import { useRef, useState } from 'react';
import { ContactSelect } from './ContactSelect';
import { Contact } from '@src/background/services/contacts/models';
import { truncateAddress } from '@src/utils/truncateAddress';
import { AddressHelper } from '@avalabs/avalanche-wallet-sdk';
import { useIdentifyAddress } from '../hooks/useIdentifyAddress';
import { ContainedDropdown } from '@src/components/common/ContainedDropdown';
import styled, { useTheme } from 'styled-components';

const RelativeContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  padding: 0 16px;
`;

const truncateName = (name: string) => {
  if (name.length < 14) return name;
  return `${name.substring(0, 14)}...`;
};

type ContactInputProps = {
  contact?: Contact;
  onChange(contact?: Contact): void;
  isContactsOpen: boolean;
  toggleContactsDropdown(to?: boolean): void;
};

export const ContactInput = ({
  contact,
  onChange,
  isContactsOpen,
  toggleContactsDropdown,
}: ContactInputProps) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLDivElement>(null);
  const identifyAddress = useIdentifyAddress();

  const changeAndCloseDropdown = (contact: Contact) => {
    onChange(contact);
    toggleContactsDropdown();
  };

  const [inputFocused, setInputFocused] = useState<boolean>(true);

  const isValidAddress = contact
    ? AddressHelper.validateAddress(contact.address) &&
      AddressHelper.getAddressChain(contact.address) === 'C'
    : false;

  const getInputDisplayValue = () => {
    if (!contact?.address) return '';
    // Show the full address string when the text field is focused
    if (inputFocused) return contact.address || '';
    let displayStr = '';
    if (contact?.isKnown) displayStr += truncateName(contact.name) + '   ';
    displayStr += isValidAddress
      ? truncateAddress(contact.address)
      : contact.address; // user is typing in the address
    return displayStr;
  };

  return (
    <RelativeContainer>
      <InputContainer ref={inputRef}>
        <Input
          autoFocus
          onChange={(e) => {
            onChange(identifyAddress(e.target.value));
          }}
          onFocus={() => {
            setInputFocused(true);
            toggleContactsDropdown(false);
          }}
          onBlur={() => setInputFocused(false)}
          value={getInputDisplayValue()}
          label="Send to"
          placeholder="Enter 0x Address"
          buttonContent={
            <HorizontalFlex align="center" paddingRight="24px">
              <ContactsIcon style={{ marginRight: 12 }} />
              <CaretIcon
                color={theme.colors.icon1}
                height="18px"
                direction={
                  isContactsOpen ? IconDirection.UP : IconDirection.DOWN
                }
              />
            </HorizontalFlex>
          }
          onButtonClicked={toggleContactsDropdown}
        />
      </InputContainer>
      <ContainedDropdown anchorEl={inputRef} isOpen={isContactsOpen}>
        <ContactSelect
          onChange={changeAndCloseDropdown}
          selectedContact={contact}
        />
      </ContainedDropdown>
    </RelativeContainer>
  );
};
