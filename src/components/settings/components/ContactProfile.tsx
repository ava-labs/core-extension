import {
  ComponentSize,
  CustomToast,
  PrimaryAddress,
  TextButton,
  toast,
  Tooltip,
  Typography,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import type { Contact } from '@avalabs/types';
import { SettingsHeader } from '../SettingsHeader';
import { useContactIdFromParams } from '@src/hooks/useContactIdFromParams';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { ContactForm } from '@src/components/settings/components/ContactForm';
import { useTranslation } from 'react-i18next';

interface ContactProfileProps {
  goBack: () => void;
  width: string;
}

const InitialsCircle = styled(VerticalFlex)`
  height: 80px;
  width: 80px;
  border-radius: 100%;
  background-color: ${({ theme }) => `${theme.colors.bg3}80`};
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

const StyledAddress = styled(PrimaryAddress)`
  width: 100%;
`;

const DeleteButton = styled(TextButton)`
  color: ${({ theme }) => theme.colors.error};
`;

export const ContactProfile = ({ goBack, width }: ContactProfileProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { contactId } = useContactIdFromParams();
  const { removeContact, updateContact, getContactById } = useContactsContext();
  const { showDialog, clearDialog } = useDialog();

  const [contact, setContact] = useState<Contact>(
    getContactById(contactId) || { id: '', name: '', address: '' }
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

  const handleChange = (contact: Contact, formValid: boolean) => {
    setContact({
      ...contact,
    });
    setIsFormValid(formValid);
  };

  const onDelete = () => {
    showDialog({
      title: t('Delete Contact?'),
      body: t('Are you sure you want to delete this contact?'),
      confirmText: t('Delete'),
      width: '343px',
      onConfirm: async () => {
        clearDialog();
        goBack();
        await removeContact(contact);
        toast.custom(<CustomToast label={t('Contact deleted!')} />);
      },
      cancelText: t('Cancel'),
      onCancel: () => {
        clearDialog();
      },
    });
  };

  const renderEditAction = (
    <Tooltip content={<Typography size={12}>{t('Edit Contact')}</Typography>}>
      <TextButton
        data-testid="profile-edit-contact"
        onClick={() => setIsEdit(true)}
      >
        <Typography size={14} height="24px" color={theme.colors.secondary1}>
          {t('Edit')}
        </Typography>
      </TextButton>
    </Tooltip>
  );

  const renderSaveAction = (
    <Tooltip content={<Typography size={12}>{t('Save Contact')}</Typography>}>
      <TextButton
        data-testid="profile-save-contact-button"
        onClick={() => {
          setShowErrors(true);
          if (!isFormValid) {
            return;
          }
          updateContact(contact);
          toast.custom(<CustomToast label={t('Contact updated!')} />);
          setIsEdit(false);
        }}
      >
        <Typography size={14} height="24px" color={theme.colors.secondary1}>
          {t('Save')}
        </Typography>
      </TextButton>
    </Tooltip>
  );

  const renderContactDetails = (
    <VerticalFlex width="100%">
      {contact.address && (
        <>
          <Typography size={12} height="15px" margin="0 0 8px 0">
            {t('Avalanche (C-Chain) Address')}
          </Typography>
          <StyledAddress address={contact.address} isTruncated={false} />
        </>
      )}
      {contact.addressBTC && (
        <>
          <Typography size={12} height="15px" margin="24px 0 8px 0">
            {t('Bitcoin Address')}
          </Typography>
          <StyledAddress address={contact.addressBTC} />
        </>
      )}
    </VerticalFlex>
  );

  return (
    <VerticalFlex
      width={width}
      background={theme.colors.bg2}
      height="100%"
      padding="0 0 24px 0"
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        title={''}
        navigateTo={() => console.log('dont do anything')}
        action={isEdit ? renderSaveAction : renderEditAction}
      />
      <VerticalFlex align="center" width="100%" padding="0 16px">
        <InitialsCircle>
          <Typography size={32} height="48px">
            {showInitials()}
          </Typography>
        </InitialsCircle>
        <Typography size={18} height="22px" weight={600} margin="24px 0">
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
      </VerticalFlex>
      {isEdit && (
        <VerticalFlex
          grow="1"
          justify="flex-end"
          align="center"
          padding="0 16px"
        >
          <DeleteButton
            data-testid="profile-delete-contact-button"
            size={ComponentSize.LARGE}
            onClick={() => onDelete()}
          >
            {t('Delete Contact')}
          </DeleteButton>
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
};
