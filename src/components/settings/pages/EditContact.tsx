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
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars-2';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useState } from 'react';
import { Contact } from '@src/background/services/contacts/models';

const PrimaryAddressWithMargin = styled(PrimaryAddress)`
  margin-top: 8px;
  width: 100%;
`;

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

const FlexScrollbars = styled(Scrollbars)`
  flex-grow: 1;
  max-height: unset;
  height: 100%;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;

const AccountName = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function EditContact({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const { editedContact, setEditedContact, createContact, removeContact } =
    useContactsContext();
  const [editedContactCopy, setEditedContactCopy] =
    useState<Contact>(editedContact);
  const splittedContactName = editedContact.name.toUpperCase().split(' ');

  const resetEditedContact = () => {
    setEditedContact(editedContactCopy);
  };

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={''}
        action={
          <TextButton
            onClick={() => {
              if (inEditMode) resetEditedContact();

              setInEditMode(!inEditMode);
            }}
          >
            {inEditMode ? 'Cancel' : 'Edit'}
          </TextButton>
        }
      />
      <FlexScrollbars>
        <VerticalFlex padding="16px">
          <HorizontalFlex justify="center">
            <Avatar>
              <Typography size={32}>
                {`${splittedContactName[0][0]}${
                  splittedContactName[1] ? splittedContactName[1][0] : ''
                }`}
              </Typography>
            </Avatar>
          </HorizontalFlex>

          {!inEditMode && (
            <AccountName
              align="center"
              size={18}
              weight="bold"
              margin="0 0 18px 0"
            >
              {editedContact.name}
            </AccountName>
          )}

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
              placeholder="Name"
              type="text"
              width="100%"
            />
          )}

          <Typography color="text2" size={14} margin="16px 0px 0px 0px">
            Address
          </Typography>
          <PrimaryAddressWithMargin
            isTruncated={false}
            address={editedContact.address}
          />
        </VerticalFlex>

        <VerticalFlex align="center" grow="1" justify="flex-end" margin="16px">
          {inEditMode ? (
            <PrimaryButton
              width="100%"
              size={ComponentSize.MEDIUM}
              onClick={async () => {
                await removeContact(editedContact);
                await createContact(editedContact);
                setEditedContactCopy(editedContact);
                toast.success('Contact updated!');
                setInEditMode(false);
              }}
              margin="0 0 24px"
              disabled={editedContact.name.length === 0}
            >
              Save
            </PrimaryButton>
          ) : (
            <TextButton
              width="100%"
              size={ComponentSize.MEDIUM}
              onClick={async () => {
                await removeContact(editedContact);
                toast.success('Contact deleted!');
                goBack();
              }}
              margin="0 0 24px"
              disabled={editedContact.name.length === 0}
            >
              Delete contact
            </TextButton>
          )}
        </VerticalFlex>
      </FlexScrollbars>
    </VerticalFlex>
  );
}
