import { ContainedDropdown } from '@/components/common/ContainedDropdown';
import { useContactsContext } from '@/contexts/ContactsProvider';
import { useNetworkContext } from '@/contexts/NetworkProvider';
import { isBech32Address } from '@avalabs/core-bridge-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  UserSearchIcon,
} from '@avalabs/core-k2-components';
import type { Contact } from '@avalabs/types';
import {
  isBitcoin,
  isPchainNetwork,
  isSolanaNetwork,
  isValidAvmAddress,
  isValidPvmAddress,
  isXchainNetwork,
  truncateAddress,
} from '@core/common';
import { isAddress as isSolanaAddress } from '@solana/kit';
import { isAddress } from 'ethers';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdentifyAddress } from '../hooks/useIdentifyAddress';
import { ContactSelect } from './ContactSelect';

const truncateName = (name: string) => {
  if (name.length < 28) return name;
  return `${name.substring(0, 28)}...`;
};

type ContactInputProps = {
  contact?: Contact;
  onChange(contact?: Contact, selectedTab?: string): void;
  isContactsOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  containerRef?: RefObject<HTMLDivElement | null>;
};

export const ContactInput = ({
  contact,
  onChange,
  isContactsOpen,
  setIsOpen,
  containerRef,
}: ContactInputProps) => {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const identifyAddress = useIdentifyAddress();
  const { contacts } = useContactsContext();
  const [contactsLength, setContactsLength] = useState(contacts.length);

  useEffect(() => {
    if (contacts.length > contactsLength) {
      const recentlyAddedContact = contacts[contacts.length - 1];
      if (isPchainNetwork(network) && recentlyAddedContact) {
        recentlyAddedContact.addressXP = recentlyAddedContact.addressXP
          ? `P-${recentlyAddedContact.addressXP}`
          : '';
      } else if (isXchainNetwork(network) && recentlyAddedContact) {
        recentlyAddedContact.addressXP = recentlyAddedContact.addressXP
          ? `X-${recentlyAddedContact.addressXP}`
          : '';
      }
      onChange(recentlyAddedContact);
    }
    setContactsLength(contacts.length);
  }, [contacts, contactsLength, network, onChange]);

  function changeAndCloseDropdown(
    selectedContact: Contact,
    selectedTab: string,
  ) {
    onChange(selectedContact, selectedTab);
    setIsOpen(!isContactsOpen);
  }

  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [inputHovered, setInputHovered] = useState<boolean>(false);

  /**
   * For BTC transactions, 'address' is empty.
   * For non-BTC transactions, 'addressBTC' is empty.
   * @see useIdentifyAddress() hook.
   */
  const contactAddress =
    network && isSolanaNetwork(network)
      ? contact?.addressSVM
      : isBitcoin(network)
        ? contact?.addressBTC
        : isPchainNetwork(network) || isXchainNetwork(network)
          ? contact?.addressXP
          : contact?.address;

  const [cursor, setCursor] = useState<number | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursor, cursor);
    }
  }, [inputRef, cursor, contactAddress]);

  const isValidAddress = (): boolean => {
    if (network?.vmName === NetworkVMType.EVM) {
      return contact ? isAddress(contact.address) : false;
    }
    if (network?.vmName === NetworkVMType.BITCOIN) {
      return contact && contact.addressBTC
        ? isBech32Address(contact.addressBTC)
        : false;
    }
    if (isPchainNetwork(network)) {
      return contact && contact.addressXP
        ? isValidPvmAddress(contact.addressXP)
        : false;
    }
    if (isXchainNetwork(network)) {
      return contact && contact.addressXP
        ? isValidAvmAddress(contact.addressXP)
        : false;
    }

    if (isSolanaNetwork(network)) {
      return Boolean(
        contact && contact.addressSVM && isSolanaAddress(contact.addressSVM),
      );
    }
    return false;
  };

  const getInputDisplayValue = () => {
    if (!contactAddress) {
      return '';
    }
    // Show the full address string when the text field is focused
    if (inputFocused) {
      return contactAddress || '';
    }

    // When address is known, show the contact's name and truncated address
    if (contact?.isKnown) {
      const address = isValidAddress()
        ? truncateAddress(contactAddress)
        : contactAddress;

      return `${truncateName(contact.name)}\n${address}`;
    }

    // For unknown addresses, always show the full address
    return contactAddress;
  };

  return (
    <Stack sx={{ position: 'relative', width: '100%', px: 2 }}>
      <Stack ref={inputWrapperRef} sx={{ gap: 1 }}>
        <Tooltip
          // Tooltip does not render at all when title is empty. Falling back to a single space prevents the input from re-rendering and losing focus when users starts typing.
          title={contactAddress ?? ' '}
          open={Boolean(!inputFocused && inputHovered && contact?.isKnown)}
          sx={{
            flexDirection: 'column',
            gap: 1,
          }}
          placement="top-end"
          PopperProps={{
            anchorEl: inputRef.current,
          }}
        >
          <TextField
            data-testid="send-address-input"
            color="primary"
            fullWidth
            label={t('Sending To')}
            inputLabelProps={{
              sx: { transform: 'none', fontSize: 'body2.fontSize', mb: 1 },
            }}
            inputRef={inputRef}
            InputProps={{
              sx: {
                py: 1,
                pl: 2,
                pr: 1,
              },
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    mt: 2,
                    alignItems: 'end',
                  }}
                >
                  <IconButton
                    onClick={() => setIsOpen(!isContactsOpen)}
                    onMouseEnter={() => setInputHovered(false)}
                    data-testid="contacts-button"
                  >
                    <UserSearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onFocus={() => {
              setInputFocused(true);
              setIsOpen(false);
            }}
            onBlur={() => setInputFocused(false)}
            onMouseEnter={() => setInputHovered(true)}
            onMouseLeave={() => setInputHovered(false)}
            placeholder={t('Input an Address')}
            multiline
            minRows={2}
            onChange={(e) => {
              onChange(identifyAddress(e.target.value.trim()));
              setCursor(e.target.selectionStart);
            }}
            value={getInputDisplayValue()}
          />
        </Tooltip>
        <ContainedDropdown
          anchorEl={inputWrapperRef}
          isOpen={isContactsOpen}
          setIsOpen={setIsOpen}
          containerRef={containerRef}
        >
          <ContactSelect
            onChange={changeAndCloseDropdown}
            selectedContact={contact}
          />
        </ContainedDropdown>
      </Stack>
    </Stack>
  );
};
