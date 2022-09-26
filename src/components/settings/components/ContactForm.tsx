import {
  ComponentSize,
  Input,
  TextArea,
  VerticalFlex,
} from '@avalabs/react-components';
import { useCallback, useEffect, useState } from 'react';
import type { Contact } from '@avalabs/types';
import { isBech32Address } from '@avalabs/bridge-sdk';
import { isAddress } from 'ethers/lib/utils';

interface ContactFormProps {
  contact: Contact;
  handleChange: (contact: Contact, formValid: boolean) => void;
  showErrors?: boolean;
  autoFocus?: boolean;
}

enum FormErrors {
  NAME_ERROR = 'Name is required',
  ADDRESS_ERROR = 'Not a valid Avalanche (C-Chain) address. C-Chain addresses being with 0x',
  ADDRESS_BTC_ERROR = 'Not a valid Bitcoin address',
  ADDRESS_REQUIRED_ERROR = 'At least one address required',
}

export const ContactForm = ({
  contact,
  handleChange,
  showErrors = false,
  autoFocus,
}: ContactFormProps) => {
  const [nameError, setNameError] = useState<string>();
  const [addressError, setAddressError] = useState<string>();
  const [addressBtcError, setAddressBtcError] = useState<string>();

  const validateForm = useCallback(
    (updatedContact: Contact) => {
      const nameExists = !!updatedContact.name;
      const addressExists = !!updatedContact.address;
      const btcExists = !!updatedContact.addressBTC;

      let valid = true;
      // no name -> error
      if (!nameExists && showErrors) {
        setNameError(FormErrors.NAME_ERROR);
        valid = false;
      }
      // no address or btc address -> error
      if (!addressExists && !btcExists && showErrors) {
        setAddressError(FormErrors.ADDRESS_REQUIRED_ERROR);
        setAddressBtcError(FormErrors.ADDRESS_REQUIRED_ERROR);
        return false;
      }
      // no valid address -> error
      if (addressExists && !isValidAddress(updatedContact.address)) {
        setAddressError(FormErrors.ADDRESS_ERROR);
        valid = false;
      }
      // no valid btc address -> error
      if (
        updatedContact.addressBTC &&
        !isValidBtcAddress(updatedContact.addressBTC)
      ) {
        setAddressBtcError(FormErrors.ADDRESS_BTC_ERROR);
        valid = false;
      }
      if (!nameExists || (!btcExists && !addressExists)) {
        valid = false;
      }

      return valid;
    },
    [showErrors]
  );

  // Used when "Save" is clicked on New Contact when no iputs filled out.
  useEffect(() => {
    if (showErrors) {
      validateForm(contact);
    }
  }, [showErrors, contact, validateForm]);

  const isValidAddress = (address: string) => {
    return !!address.length && isAddress(address);
  };

  const isValidBtcAddress = (address: string) => {
    return !!address.length && isBech32Address(address);
  };

  const resetErrors = () => {
    setNameError('');
    setAddressError('');
    setAddressBtcError('');
  };

  const handleUpdate = (name: keyof Contact, value: string) => {
    resetErrors();
    handleChange(
      {
        ...contact,
        [name]: value,
      },
      validateForm({
        ...contact,
        [name]: value,
      })
    );
  };

  return (
    <VerticalFlex width="100%">
      <Input
        data-testid="address-name-input"
        autoFocus={autoFocus}
        onChange={(e) => {
          e.stopPropagation();
          handleUpdate('name', e.target.value);
        }}
        value={contact.name}
        label="Name"
        error={!!nameError}
        errorMessage={nameError}
        placeholder="Enter address name"
        width="100%"
      />

      <TextArea
        data-testid="ava-address-textarea"
        size={ComponentSize.SMALL}
        margin="24px 0px 0px"
        onChange={(e) => {
          e.stopPropagation();
          handleUpdate('address', e.target.value);
        }}
        value={contact.address}
        label="Avalanche (C-Chain) Address"
        error={!!addressError}
        errorMessage={addressError}
        placeholder="Enter contact's Avalanche (C-Chain) address"
        width="100%"
      />
      <TextArea
        data-testid="btc-address-textarea"
        size={ComponentSize.SMALL}
        onChange={(e) => {
          e.stopPropagation();
          handleUpdate('addressBTC', e.target.value);
        }}
        value={contact.addressBTC}
        label="Bitcoin Address"
        error={!!addressBtcError}
        errorMessage={addressBtcError}
        placeholder="Enter contact's Bitcoin address"
        width="100%"
        margin="12px 0 0"
      />
    </VerticalFlex>
  );
};
