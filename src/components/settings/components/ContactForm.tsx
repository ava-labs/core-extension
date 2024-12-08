import { useCallback, useEffect, useState } from 'react';
import type { Contact } from '@avalabs/types';
import {
  isValidAddress,
  isValidBtcAddress,
  isValidXPAddress,
} from '@src/utils/isAddressValid';
import { useTranslation } from 'react-i18next';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { Stack, TextField } from '@avalabs/core-k2-components';
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
  const [addressXpError, setAddressXpError] = useState<string>();
  const { contacts } = useContactsContext();

  const FormErrors = {
    NAME_ERROR: t('Name is required'),
    ADDRESS_ERROR: t(
      'Not a valid Avalanche (C-Chain) address. C-Chain addresses being with 0x',
    ),
    ADDRESS_BTC_ERROR: t('Not a valid Bitcoin address'),
    ADDRESS_XP_ERROR: t('Not a valid X/P-Chain address'),
    ADDRESS_XP_PREFIX_ERROR: t('Please remove address prefix. (P- or X-)'),
    ADDRESS_REQUIRED_ERROR: t('At least one address required'),
    ADDRESS_EXISTS: t('This address already exists in the address book'),
  };

  const validateForm = useCallback(
    (updatedContact: Contact) => {
      const nameExists = !!updatedContact.name;
      const addressExists = !!updatedContact.address;
      const btcExists = !!updatedContact.addressBTC;
      const xpExists = !!updatedContact.addressXP;
      let valid = true;
      // no name -> error
      if (!nameExists && showErrors) {
        setNameError(FormErrors.NAME_ERROR);
        valid = false;
      }
      // no address, btc address, pvm address -> error
      if (!addressExists && !btcExists && !xpExists && showErrors) {
        setAddressError(FormErrors.ADDRESS_REQUIRED_ERROR);
        setAddressBtcError(FormErrors.ADDRESS_REQUIRED_ERROR);
        setAddressXpError(FormErrors.ADDRESS_REQUIRED_ERROR);
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
      // Invalid PVM address -> error

      if (updatedContact.addressXP) {
        if (
          updatedContact.addressXP.startsWith('P-') ||
          updatedContact.addressXP.startsWith('X-')
        ) {
          setAddressXpError(FormErrors.ADDRESS_XP_PREFIX_ERROR);
          valid = false;
        } else if (!isValidXPAddress(updatedContact.addressXP)) {
          setAddressXpError(FormErrors.ADDRESS_XP_ERROR);
          valid = false;
        }
      }

      if (!nameExists || (!btcExists && !addressExists && !xpExists)) {
        valid = false;
      }

      if (
        updatedContact.address &&
        contacts.find(
          ({ id, address }) =>
            id !== updatedContact.id && address === updatedContact.address,
        )
      ) {
        setAddressError(FormErrors.ADDRESS_EXISTS);
        valid = false;
      }

      if (
        updatedContact.addressBTC &&
        contacts.find(
          ({ id, addressBTC }) =>
            id !== updatedContact.id &&
            addressBTC === updatedContact.addressBTC,
        )
      ) {
        setAddressBtcError(FormErrors.ADDRESS_EXISTS);
        valid = false;
      }

      return valid;
    },
    [
      showErrors,
      contacts,
      FormErrors.NAME_ERROR,
      FormErrors.ADDRESS_REQUIRED_ERROR,
      FormErrors.ADDRESS_ERROR,
      FormErrors.ADDRESS_BTC_ERROR,
      FormErrors.ADDRESS_XP_PREFIX_ERROR,
      FormErrors.ADDRESS_XP_ERROR,
      FormErrors.ADDRESS_EXISTS,
    ],
  );

  // Used when "Save" is clicked on New Contact when no iputs filled out.
  useEffect(() => {
    if (showErrors) {
      validateForm(contact);
    }
  }, [showErrors, contact, validateForm]);

  const resetErrors = () => {
    setNameError('');
    setAddressError('');
    setAddressBtcError('');
    setAddressXpError('');
  };

  const sanitizeXPAddress = (address: string) => {
    if (address.startsWith('P-') || address.startsWith('X-')) {
      return address.substring(2, address.length);
    } else {
      return address;
    }
  };

  const handleUpdate = (name: keyof Contact, value: string) => {
    resetErrors();

    const newContact = {
      ...contact,
      [name]: value,
    };

    handleChange(newContact, validateForm(newContact));
  };

  return (
    <Stack sx={{ width: '100%', rowGap: 4 }}>
      <TextField
        data-testid="address-name-input"
        autoFocus={autoFocus}
        onChange={(e) => {
          e.stopPropagation();
          handleUpdate('name', e.target.value);
        }}
        label={t('Name')}
        error={!!nameError}
        placeholder={t('Enter address name')}
        helperText={nameError}
        fullWidth
        value={contact.name}
        size="small"
      />

      <TextField
        data-testid="ava-address-textarea"
        size="small"
        onChange={(e) => {
          e.stopPropagation();
          handleUpdate('address', e.target.value);
        }}
        value={contact.address}
        label={t('Avalanche (C-Chain) Address')}
        error={!!addressError}
        helperText={addressError}
        placeholder={t(`Enter Avalanche (C-Chain) address`)}
        fullWidth
        multiline
        rows={2}
      />

      <TextField
        data-testid="btc-address-textarea"
        size="small"
        onChange={(e) => {
          e.stopPropagation();
          handleUpdate('addressBTC', e.target.value);
        }}
        value={contact.addressBTC}
        label={t('Bitcoin Address')}
        error={!!addressBtcError}
        helperText={addressBtcError}
        placeholder={t(`Enter Bitcoin address`)}
        fullWidth
        multiline
        rows={2}
      />

      <TextField
        data-testid="xp-address-textarea"
        size="small"
        onChange={(e) => {
          e.stopPropagation();
          handleUpdate('addressXP', e.target.value);
        }}
        onPaste={(e) => {
          e.preventDefault();
          const pastedAddress = e.clipboardData.getData('Text');
          handleUpdate('addressXP', sanitizeXPAddress(pastedAddress));
        }}
        value={contact.addressXP}
        label={t('Avalanche (X/P-Chain) Address')}
        error={!!addressXpError}
        helperText={addressXpError}
        placeholder={t(`Enter X/P-Chain address`)}
        fullWidth
        multiline
        rows={2}
      />
    </Stack>
  );
};
