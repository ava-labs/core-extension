import React from 'react';
import {
  toast,
  Typography,
  VerticalFlex,
  Input,
  PrimaryButton,
  ComponentSize,
  PrimaryAddress,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { useContactsContext } from '@src/contexts/ContactsProvider';

const PrimaryAddressWithMargin = styled(PrimaryAddress)`
  margin-top: 8px;
  width: 100%;
`;

export function EditContact({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { editedContact, setEditedContact, createContact, removeContact } =
    useContactsContext();

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Edit Contact'}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <VerticalFlex padding="16px">
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

          <Typography color="text2" size={14} margin="16px 0px 0px 0px">
            Address
          </Typography>
          <PrimaryAddressWithMargin
            isTruncated={false}
            address={editedContact.address}
          />
        </VerticalFlex>

        <VerticalFlex align="center" grow="1" justify="flex-end" margin="16px">
          <PrimaryButton
            width="100%"
            size={ComponentSize.LARGE}
            onClick={async () => {
              await removeContact(editedContact);
              await createContact(editedContact);
              toast.success('Contact updated!');
              goBack();
            }}
            margin="0 0 24px"
            disabled={editedContact.name.length === 0}
          >
            Update
          </PrimaryButton>
        </VerticalFlex>
      </Scrollbars>
    </VerticalFlex>
  );
}
