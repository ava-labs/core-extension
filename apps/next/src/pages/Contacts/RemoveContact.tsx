import { Button, Stack, StackProps, toast } from '@avalabs/k2-alpine';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';

import { useContactsContext } from '@core/ui';

import { Page } from '@/components/Page';
import { CONTACTS_QUERY_TOKENS, getContactsPath } from '@/config/routes';

import { RemoveContactWarning } from './components/RemoveContactWarning';

const contentProps: StackProps = {
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
  flexGrow: 1,
};

export const RemoveContact = () => {
  const { t } = useTranslation();
  const { goBack, replace } = useHistory();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const id = searchParams.get(CONTACTS_QUERY_TOKENS.id);

  const { getContactById, removeContact } = useContactsContext();

  const contact = id ? getContactById(id) : undefined;

  const [isRemoving, setIsRemoving] = useState(false);

  const onDelete = useCallback(async () => {
    if (!contact) {
      return;
    }

    setIsRemoving(true);
    try {
      await removeContact(contact);
      toast.success(t('Contact deleted'));
      replace(getContactsPath('list'));
    } catch (error) {
      console.error(error);
      toast.error(t('Failed to delete contact'));
    } finally {
      setIsRemoving(false);
    }
  }, [contact, removeContact, t, replace]);

  if (!contact) {
    return <Redirect to={getContactsPath('list')} />;
  }

  return (
    <Page
      withBackButton
      contentProps={contentProps}
      title={t('Are you sure you want to delete this contact?')}
    >
      <Stack width="100%" mt={2} gap={3}>
        <RemoveContactWarning />
      </Stack>
      <Stack width="100%" gap={1} minHeight={100} justifyContent="flex-end">
        <Button
          data-testid="confirm-delete-contact-button"
          variant="contained"
          color="secondary"
          sx={{ color: 'error.main' }}
          size="small"
          fullWidth
          disabled={isRemoving}
          loading={isRemoving}
          onClick={onDelete}
        >
          {t('Delete')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          disabled={isRemoving}
          onClick={goBack}
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Page>
  );
};
