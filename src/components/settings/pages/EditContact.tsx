import React from 'react';
import {
  CopyIcon,
  toast,
  Typography,
  VerticalFlex,
  HorizontalFlex,
  Input,
  PrimaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { useContactsContext } from '@src/contexts/ContactsProvider';

const AddressBlock = styled(HorizontalFlex)`
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 6px 0px 0px 0px;
  border: solid 1px ${({ theme }) => theme.colors.stroke1};
  width: 100%;

  & > ${Typography} {
    word-break: break-all;
  }
`;

export function EditContact({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { editedContact, setEditedContact, updateContact } =
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
            //error={!!error}
            width="100%"
          />

          <Typography color="text2" size={14} margin="16px 0px 0px 0px">
            Address
          </Typography>
          <AddressBlock
            onClick={() => {
              navigator.clipboard.writeText(editedContact.address);
              toast.success('Copied!');
            }}
          >
            <Typography margin="0px 8px 0px 0px">
              {editedContact.address}
            </Typography>
            <CopyIcon color={theme.colors.icon1} />
          </AddressBlock>
        </VerticalFlex>

        <VerticalFlex align="center" grow="1" justify="flex-end" margin="16px">
          <PrimaryButton
            width="100%"
            size={ComponentSize.LARGE}
            onClick={() => {
              updateContact();
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
