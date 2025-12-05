import {
  AvatarHex,
  Button,
  Divider,
  Stack,
  StackProps,
  styled,
  toast,
} from '@avalabs/k2-alpine';
import { Contact } from '@avalabs/types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';

import { isContactValid } from '@core/common';
import { useContactsContext, useAnalyticsContext } from '@core/ui';

import { Page } from '@/components/Page';
import { Card } from '@/components/Card';
import { getContactsPath } from '@/config/routes';

import {
  BTCAddressField,
  EVMAddressField,
  SVMAddressField,
  XPAddressField,
  ContactNameField,
} from './components';

const contentProps: StackProps = {
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
  flexGrow: 1,
};

export const AddContact = () => {
  const { t } = useTranslation();
  const { goBack, replace } = useHistory();

  const { createContact } = useContactsContext();
  const { capture } = useAnalyticsContext();

  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isNaming, setIsNaming] = useState(false);

  const [addressC, setAddressC] = useState('');
  const [addressXP, setAddressXP] = useState('');
  const [addressBTC, setAddressBTC] = useState('');
  const [addressSVM, setAddressSVM] = useState('');

  const saveContact = useCallback(
    async (payload: Omit<Contact, 'id'>) => {
      setIsSaving(true);
      capture('AddContactClicked');
      try {
        const id = crypto.randomUUID();
        await createContact({
          id,
          ...payload,
        });
        toast.success(t('Contact created'));
        capture('AddContactSucceeded');
        replace(getContactsPath('details', { id }));
      } catch (error) {
        console.error(error);
        toast.error(t('Failed to save contact'));
        capture('AddContactFailed');
      } finally {
        setIsSaving(false);
      }
    },
    [createContact, t, replace, capture],
  );

  const { valid: isValid } = isContactValid({
    name,
    address: addressC,
    addressXP,
    addressBTC,
    addressSVM,
  });

  return (
    <Page withBackButton contentProps={contentProps}>
      <Stack gap={4} width="100%" flexGrow={1}>
        <Stack width="100%" gap={3} alignItems="center">
          {/* TODO: Choose & save the contact's avatar */}
          <AvatarHex size="large" alt="Contact" />
          <ContactNameField
            name={name}
            setName={setName}
            isNaming={isNaming}
            setIsNaming={setIsNaming}
            autoFocus
          />
        </Stack>
        <AddressesCard>
          <EVMAddressField value={addressC} onChange={setAddressC} />
          <Divider />
          <XPAddressField value={addressXP} onChange={setAddressXP} />
          <Divider />
          <BTCAddressField value={addressBTC} onChange={setAddressBTC} />
          <Divider />
          <SVMAddressField value={addressSVM} onChange={setAddressSVM} />
        </AddressesCard>
      </Stack>
      <Stack width="100%" gap={1}>
        <Button
          variant="contained"
          color="primary"
          size="extension"
          fullWidth
          disabled={isSaving || !isValid}
          loading={isSaving}
          onClick={() =>
            saveContact({
              name,
              address: addressC,
              addressXP,
              addressBTC,
              addressSVM,
            })
          }
        >
          {t('Save')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="extension"
          fullWidth
          disabled={isSaving}
          onClick={goBack}
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Page>
  );
};

const AddressesCard = styled(Card)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.mediumBorderRadius,
  paddingInline: theme.spacing(2),
}));
