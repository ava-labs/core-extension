import { useCallback, useEffect, useState } from 'react';
import type { Contact } from '@avalabs/types';
import { isValidAddress, isValidBtcAddress } from '@src/utils/isAddressValid';
import { useTranslation } from 'react-i18next';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { Stack, TextField } from '@avalabs/k2-components';
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
    <Stack sx={{ width: '100%' }}>
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
        light
      />

      <Stack sx={{ py: 4 }}>
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
          light
        />
      </Stack>

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
        light
      />
    </Stack>
  );
};
