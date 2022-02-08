import {
  toast,
  Typography,
  VerticalFlex,
  Input,
  PrimaryButton,
  ComponentSize,
  PrimaryAddress,
  TextButton,
  HorizontalFlex,
  useDialog,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useState } from 'react';
import { Contact } from '@src/background/services/contacts/models';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';

const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 160px;
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  background-color: ${({ theme }) => theme.colors.bg3};
`;

const AccountName = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledPrimaryAddress = styled(PrimaryAddress)`
  width: 100%;
`;

export function EditContact({
  goBack,
  navigateTo,
  width,
  onClose,
}: SettingsPageProps) {
  const { showDialog, clearDialog } = useDialog();
  const theme = useTheme();
  const setSendDataInParams = useSetSendDataInParams();
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const { editedContact, setEditedContact, createContact, removeContact } =
    useContactsContext();
  const [editedContactCopy, setEditedContactCopy] =
    useState<Contact>(editedContact);
  const splittedContactName = editedContact.name.toUpperCase().split(' ');

  const resetEditedContact = () => {
    setEditedContact(editedContactCopy);
  };

  const onDeleteAccount = () => {
    showDialog({
      title: 'Delete Contact?',
      body: 'Are you sure you want to delete this contact?',
      confirmText: 'Delete',
      width: '343px',
      onConfirm: async () => {
        clearDialog();
        await removeContact(editedContact);
        toast.success('Contact deleted!');
        goBack();
      },
      cancelText: 'Cancel',
      onCancel: () => {
        clearDialog();
      },
    });
  };

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={() => {
          if (inEditMode) {
            resetEditedContact();
            setInEditMode(!inEditMode);
          } else {
            goBack();
          }
        }}
        navigateTo={navigateTo}
        title={''}
        action={
          <TextButton
            onClick={async () => {
              if (inEditMode) {
                await removeContact(editedContact);
                await createContact(editedContact);
                setEditedContactCopy(editedContact);
                toast.success('Contact updated!');
              }
              setInEditMode(!inEditMode);
            }}
            disabled={inEditMode && editedContact.name.length === 0}
          >
            {inEditMode ? 'Save' : 'Edit'}
          </TextButton>
        }
      />
      <VerticalFlex padding="0 16px" grow="1">
        <HorizontalFlex justify="center" margin="16px 0 24px">
          <Avatar>
            <Typography size={32}>
              {`${splittedContactName[0][0]}${
                splittedContactName[1] ? splittedContactName[1][0] : ''
              }`}
            </Typography>
          </Avatar>
        </HorizontalFlex>

        <AccountName
          align="center"
          size={18}
          height="22px"
          weight={600}
          margin="0 0 24px"
        >
          {!inEditMode && editedContact.name}
        </AccountName>

        {inEditMode && (
          <Input
            autoFocus
            onChange={(e) => {
              setEditedContact({
                ...editedContact,
                name: e.target.value,
              });
            }}
            value={editedContact.name}
            label="Name"
            placeholder="Enter Address Name"
            type="text"
            width="100%"
            margin="0 0 16px"
          />
        )}

        <Typography size={12} height="15px" margin="0 0 8px">
          Address
        </Typography>
        <StyledPrimaryAddress
          isTruncated={false}
          address={editedContact.address}
        />

        <VerticalFlex
          align="center"
          grow="1"
          justify="flex-end"
          margin="0 0 24px"
        >
          {inEditMode ? (
            <TextButton
              margin="0 0 8px"
              width="100%"
              size={ComponentSize.LARGE}
              onClick={onDeleteAccount}
              disabled={editedContact.name.length === 0}
            >
              Delete Contact
            </TextButton>
          ) : (
            <PrimaryButton
              width="100%"
              size={ComponentSize.LARGE}
              onClick={() => {
                setSendDataInParams({
                  address: editedContact.address,
                  options: { path: '/send' },
                });
                onClose?.();
              }}
            >
              Send
            </PrimaryButton>
          )}
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
