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
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';

import { useContactsContext } from '@core/ui';
import { isContactValid, noop } from '@core/common';

import { Page } from '@/components/Page';
import { Card } from '@/components/Card';
import { CONTACTS_QUERY_TOKENS, getContactsPath } from '@/config/routes';

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

export const ContactDetails = () => {
  const { t } = useTranslation();
  const { goBack, replace } = useHistory();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const id = searchParams.get(CONTACTS_QUERY_TOKENS.id);

  const { getContactById, updateContact, removeContact } = useContactsContext();

  const contact = id ? getContactById(id) : undefined;

  const [name, setName] = useState(contact?.name ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const [addressC, setAddressC] = useState(contact?.address ?? '');
  const [addressXP, setAddressXP] = useState(contact?.addressXP ?? '');
  const [addressBTC, setAddressBTC] = useState(contact?.addressBTC ?? '');
  const [addressSVM, setAddressSVM] = useState(contact?.addressSVM ?? '');

  const hasChanges =
    name !== contact?.name ||
    addressC !== contact?.address ||
    addressXP !== contact?.addressXP ||
    addressBTC !== contact?.addressBTC ||
    addressSVM !== contact?.addressSVM;

  const onDelete = useCallback(async () => {
    if (!contact) {
      return;
    }

    setIsSaving(true);
    try {
      await removeContact(contact);
      toast.success(t('Contact deleted'));
      replace(getContactsPath('list'));
    } catch (error) {
      console.error(error);
      toast.error(t('Failed to delete contact'));
    } finally {
      setIsSaving(false);
    }
  }, [contact, removeContact, t, replace]);

  const save = useCallback(
    async (payload: Contact) => {
      setIsSaving(true);

      try {
        await updateContact(payload);
        toast.success(t('Contact updated'));
      } catch (error) {
        console.error(error);
        toast.error(t('Failed to save contact'));
      } finally {
        setIsSaving(false);
      }
    },
    [updateContact, t],
  );

  if (!contact) {
    return <Redirect to={getContactsPath('list')} />;
  }

  const { valid: isValid } = isContactValid({
    name,
    address: addressC,
    addressXP,
    addressBTC,
    addressSVM,
  });

  return (
    <Page withBackButton contentProps={contentProps}>
      <Stack width="100%" gap={3} alignItems="center">
        {/* TODO: Choose & save the contact's avatar */}
        <AvatarHex size="large" alt="Contact" />
        <ContactNameField
          name={name}
          setName={setName}
          isNaming
          setIsNaming={noop}
          autoFocus={false}
        />
      </Stack>
      <AddressesCard>
        <EVMAddressField value={addressC} onChange={setAddressC} allowCopy />
        <Divider />
        <XPAddressField value={addressXP} onChange={setAddressXP} allowCopy />
        <Divider />
        <BTCAddressField
          value={addressBTC}
          onChange={setAddressBTC}
          allowCopy
        />
        <Divider />
        <SVMAddressField
          value={addressSVM}
          onChange={setAddressSVM}
          allowCopy
        />
      </AddressesCard>
      <Stack width="100%" gap={1} minHeight={100} justifyContent="flex-end">
        {hasChanges ? (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              disabled={isSaving || !isValid}
              loading={isSaving}
              onClick={() =>
                save({
                  id: contact.id,
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
              size="small"
              fullWidth
              disabled={isSaving}
              onClick={goBack}
            >
              {t('Cancel')}
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            sx={{ color: 'error.main' }}
            size="small"
            fullWidth
            disabled={isSaving}
            loading={isSaving}
            onClick={onDelete}
          >
            {t('Delete')}
          </Button>
        )}
      </Stack>
    </Page>
  );
};

const AddressesCard = styled(Card)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.mediumBorderRadius,
  paddingInline: theme.spacing(2),
}));
