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
import { useTranslation } from 'react-i18next';
import { useContactsContext } from '@src/contexts/ContactsProvider';
interface ContactFormProps {
  contact: Contact;
  handleChange: (contact: Contact, formValid: boolean) => void;
  showErrors?: boolean;
  autoFocus?: boolean;
}

export const ContactForm = ({
  contact,
  handleChange,
  showErrors = false,
  autoFocus,
}: ContactFormProps) => {
  const { t } = useTranslation();
  const [nameError, setNameError] = useState<string>();
  const [addressError, setAddressError] = useState<string>();
  const [addressBtcError, setAddressBtcError] = useState<string>();
  const { contacts } = useContactsContext();

  const FormErrors = {
    NAME_ERROR: t('Name is required'),
    ADDRESS_ERROR: t(
      'Not a valid Avalanche (C-Chain) address. C-Chain addresses being with 0x'
    ),
    ADDRESS_BTC_ERROR: t('Not a valid Bitcoin address'),
    ADDRESS_REQUIRED_ERROR: t('At least one address required'),
    ADDRESS_EXISTS: t('This address already exists in the address book'),
  };

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

      if (
        updatedContact.address &&
        contacts.find(
          (contact) =>
            contact.id !== updatedContact.id &&
            contact.address === updatedContact.address
        )
      ) {
        setAddressError(FormErrors.ADDRESS_EXISTS);
        valid = false;
      }

      if (
        updatedContact.addressBTC &&
        contacts.find(
          (contact) =>
            contact.id !== updatedContact.id &&
            contact.addressBTC === updatedContact.addressBTC
        )
      ) {
        setAddressBtcError(FormErrors.ADDRESS_EXISTS);
        valid = false;
      }

      return valid;
    },
    [
      FormErrors.ADDRESS_BTC_ERROR,
      FormErrors.ADDRESS_ERROR,
      FormErrors.ADDRESS_EXISTS,
      FormErrors.ADDRESS_REQUIRED_ERROR,
      FormErrors.NAME_ERROR,
      contacts,
      showErrors,
    ]
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
        label={t('Name')}
        error={!!nameError}
        errorMessage={nameError}
        placeholder={t('Enter address name')}
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
        label={t('Avalanche (C-Chain) Address')}
        error={!!addressError}
        errorMessage={addressError}
        placeholder={t(`Enter contact's Avalanche (C-Chain) address`)}
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
        label={t('Bitcoin Address')}
        error={!!addressBtcError}
        errorMessage={addressBtcError}
        placeholder={t(`Enter contact's Bitcoin address`)}
        width="100%"
        margin="12px 0 0"
      />
    </VerticalFlex>
  );
};
