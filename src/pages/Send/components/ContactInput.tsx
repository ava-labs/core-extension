import {
  Input,
  ContactsIcon,
  HorizontalFlex,
  CaretIcon,
  IconDirection,
} from '@avalabs/react-components';
import { useRef, useState } from 'react';
import { ContactSelect } from './ContactSelect';
import type { Contact } from '@avalabs/types';
import { truncateAddress } from '@src/utils/truncateAddress';
import { useIdentifyAddress } from '../hooks/useIdentifyAddress';
import { ContainedDropdown } from '@src/components/common/ContainedDropdown';
import styled, { useTheme } from 'styled-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkVMType } from '@avalabs/chains-sdk';
import { isBech32Address } from '@avalabs/bridge-sdk';
import { isAddress } from 'ethers/lib/utils';
import { t } from 'i18next';

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
  onChange(contact?: Contact, selectedTab?: string): void;
  isContactsOpen: boolean;
  toggleContactsDropdown(to?: boolean): void;
  setIsOpen: (isOpen: boolean) => void;
};

export const ContactInput = ({
  contact,
  onChange,
  isContactsOpen,
  toggleContactsDropdown,
  setIsOpen,
}: ContactInputProps) => {
  const theme = useTheme();
  const { network } = useNetworkContext();
  const inputRef = useRef<HTMLDivElement>(null);
  const identifyAddress = useIdentifyAddress();

  const changeAndCloseDropdown = (contact: Contact, selectedTab: string) => {
    onChange(contact, selectedTab);
    toggleContactsDropdown();
  };

  const [inputFocused, setInputFocused] = useState<boolean>(true);

  const isValidAddress = (): boolean => {
    if (network?.vmName === NetworkVMType.EVM) {
      return contact ? isAddress(contact.address) : false;
    }
    if (network?.vmName === NetworkVMType.BITCOIN) {
      return contact ? isBech32Address(contact.address) : false;
    }
    return false;
  };

  const getInputDisplayValue = () => {
    if (!contact?.address) return '';
    // Show the full address string when the text field is focused
    if (inputFocused) return contact.address || '';
    let displayStr = '';
    if (contact?.isKnown) displayStr += truncateName(contact.name) + '   ';
    displayStr += isValidAddress()
      ? truncateAddress(contact.address)
      : contact.address; // user is typing in the address
    return displayStr;
  };

  const inputPlaceholder =
    network?.vmName === NetworkVMType.BITCOIN
      ? t('Enter Bitcoin Address')
      : t('Enter 0x Address');

  return (
    <RelativeContainer>
      <InputContainer ref={inputRef}>
        <Input
          data-testid="send-address-input"
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
          label={t('Send to')}
          placeholder={inputPlaceholder}
          buttonContent={
            <HorizontalFlex data-testid="send-address-book" align="center">
              <ContactsIcon height="20px" style={{ marginRight: 12 }} />
              <CaretIcon
                color={theme.colors.icon1}
                height="16px"
                direction={
                  isContactsOpen ? IconDirection.UP : IconDirection.DOWN
                }
              />
            </HorizontalFlex>
          }
          onButtonClicked={toggleContactsDropdown}
        />
      </InputContainer>
      <ContainedDropdown
        anchorEl={inputRef}
        isOpen={isContactsOpen}
        setIsOpen={setIsOpen}
      >
        <ContactSelect
          onChange={changeAndCloseDropdown}
          selectedContact={contact}
        />
      </ContainedDropdown>
    </RelativeContainer>
  );
};
