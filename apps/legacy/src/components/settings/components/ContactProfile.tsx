import { useState } from 'react';
import type { Contact } from '@avalabs/types';
import { SettingsHeader } from '../SettingsHeader';
import { useContactIdFromParams } from '@core/ui';
import { useContactsContext } from '@core/ui';
import { ContactForm } from '@/components/settings/components/ContactForm';
import { Trans, useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
  Tooltip,
  toast,
  Scrollbars,
  CopyIcon,
} from '@avalabs/core-k2-components';
import Dialog from '@/components/common/Dialog';
import { truncateAddress } from '@core/common';
import { useIsSolanaEnabled } from '@core/ui';

interface ContactProfileProps {
  goBack: () => void;
  width: string;
}

export const ContactProfile = ({ goBack, width }: ContactProfileProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSolanaEnabled = useIsSolanaEnabled();
  const { contactId } = useContactIdFromParams();
  const { removeContact, updateContact, getContactById } = useContactsContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [contact, setContact] = useState<Contact>(
    getContactById(contactId) || { id: '', name: '', address: '' },
  );
  const [isEdit, setIsEdit] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showErrors, setShowErrors] = useState(false);

  const showInitials = () => {
    return contact.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleChange = (newContact: Contact, formValid: boolean) => {
    setContact({
      ...newContact,
    });
    setIsFormValid(formValid);
  };

  const deleteDialogContent = (
    <Stack sx={{ justifyContent: 'center', width: '100%' }}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        {t('Delete Contact?')}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
        <Trans i18nKey="Are you sure you want to delete<br /> this contact?" />
      </Typography>
      <Stack
        sx={{
          mt: 3,
        }}
      >
        <Button
          sx={{ mb: 1 }}
          onClick={() => {
            goBack();
            toast.promise(
              removeContact(contact),
              {
                loading: t('removing'),
                success: t('Contact Deleted'),
                error: t('Something went wrong'),
              },
              {
                success: {
                  duration: 2000,
                },
              },
            );
            setShowDeleteDialog(false);
          }}
        >
          {t('Delete')}
        </Button>
        <Button variant="text" onClick={() => setShowDeleteDialog(false)}>
          {t('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );

  const renderEditAction = (
    <Tooltip title={t('Edit Contact')}>
      <Button
        variant="text"
        color="secondary"
        data-testid="profile-edit-contact"
        onClick={() => setIsEdit(true)}
      >
        {t('Edit')}
      </Button>
    </Tooltip>
  );

  const renderSaveAction = (
    <Tooltip title={t('Save Contact')}>
      <Button
        variant="text"
        color="secondary"
        data-testid="profile-save-contact-button"
        onClick={() => {
          setShowErrors(true);
          if (!isFormValid) {
            return;
          }
          toast.promise(
            updateContact(contact),
            {
              loading: t('saving...'),
              success: t('Contact updated!'),
              error: t('Something went wrong'),
            },
            {
              success: {
                duration: 2000,
              },
            },
          );
          setIsEdit(false);
        }}
      >
        {t('Save')}
      </Button>
    </Tooltip>
  );

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success(t('Copied!'), { duration: 2000 });
  };

  const renderContactDetails = (
    <Stack sx={{ width: '100%' }}>
      {contact.address && (
        <>
          <Tooltip
            title={contact.address}
            sx={{ display: 'block' }}
            disableInteractive
          >
            <TextField
              size="small"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <CopyIcon
                    onClick={(ev) => {
                      ev.stopPropagation();
                      copyAddress(contact.address);
                    }}
                    sx={{
                      cursor: 'pointer',
                    }}
                  />
                ),
              }}
              value={truncateAddress(contact.address)}
              label={t('Avalanche (C-Chain) Address')}
              placeholder={t(`Enter Avalanche (C-Chain) address`)}
              fullWidth
              rows={2}
            />
          </Tooltip>
        </>
      )}
      {contact.addressXP && (
        <Stack sx={{ mt: 4 }}>
          <Tooltip
            title={contact.addressXP}
            sx={{ display: 'block' }}
            disableInteractive
          >
            <TextField
              size="small"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <CopyIcon
                    onClick={(ev) => {
                      ev.stopPropagation();
                      copyAddress(contact.addressXP || '');
                    }}
                    sx={{
                      cursor: 'pointer',
                    }}
                  />
                ),
              }}
              value={truncateAddress(contact.addressXP)}
              label={t('Avalanche (X/P-Chain) Address')}
              placeholder={t(`Enter X/P-Chain address`)}
              fullWidth
              rows={2}
            />
          </Tooltip>
        </Stack>
      )}
      {contact.addressBTC && (
        <Stack sx={{ mt: 4 }}>
          <Tooltip
            title={contact.addressBTC}
            sx={{ display: 'block' }}
            disableInteractive
          >
            <TextField
              size="small"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <CopyIcon
                    onClick={(ev) => {
                      ev.stopPropagation();
                      copyAddress(contact.addressBTC || '');
                    }}
                    sx={{
                      cursor: 'pointer',
                    }}
                  />
                ),
              }}
              value={truncateAddress(contact.addressBTC)}
              label={t('Bitcoin Address')}
              placeholder={t(`Enter Bitcoin address`)}
              fullWidth
              rows={2}
            />
          </Tooltip>
        </Stack>
      )}
      {isSolanaEnabled && contact.addressSVM && (
        <Stack sx={{ mt: 4 }}>
          <Tooltip
            title={contact.addressSVM}
            sx={{ display: 'block' }}
            disableInteractive
          >
            <TextField
              size="small"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <CopyIcon
                    onClick={(ev) => {
                      ev.stopPropagation();
                      copyAddress(contact.addressSVM || '');
                    }}
                    sx={{
                      cursor: 'pointer',
                    }}
                  />
                ),
              }}
              value={truncateAddress(contact.addressSVM)}
              label={t('Solana Address')}
              fullWidth
              rows={2}
            />
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );

  return (
    <Stack width={width} sx={{ height: '100%', pb: 2 }}>
      <SettingsHeader
        width={width}
        goBack={goBack}
        title={''}
        navigateTo={() => console.log('dont do anything')}
        action={isEdit ? renderSaveAction : renderEditAction}
      />
      <Scrollbars>
        <Stack
          sx={{
            alignItems: 'center',
            width: '100%',
            px: 2,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: `${theme.customPalette.alternates.blue.main}`,
            }}
          >
            <Typography variant="h1" sx={{ fontWeight: 'fontWeightBold' }}>
              {showInitials()}
            </Typography>
          </Avatar>
          <Typography variant="h4" sx={{ my: 3 }}>
            {contact.name}
          </Typography>
          {isEdit ? (
            <ContactForm
              contact={contact}
              handleChange={handleChange}
              showErrors={showErrors}
            />
          ) : (
            renderContactDetails
          )}
        </Stack>
        {isEdit && (
          <Stack
            sx={{
              flexGrow: '1',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button
              data-testid="profile-delete-contact-button"
              variant="text"
              size="medium"
              color="error"
              onClick={() => setShowDeleteDialog(true)}
              sx={{ mt: 2 }}
            >
              {t('Delete Contact')}
            </Button>
          </Stack>
        )}
      </Scrollbars>
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        content={deleteDialogContent}
        bgColorDefault
      />
    </Stack>
  );
};
