import React, { useState } from 'react';
import {
  toast,
  VerticalFlex,
  Input,
  PrimaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { Contact, useContactsContext } from '@src/contexts/ContactsProvider';
import { AddressHelper } from '@avalabs/avalanche-wallet-sdk';

export function AddContact({ goBack, navigateTo, width }: SettingsPageProps) {
  const [contact, setContact] = useState<Contact>({ name: '', address: '' });
  const theme = useTheme();
  const { addContact } = useContactsContext();
  const isValidAddress =
    AddressHelper.validateAddress(contact.address) &&
    AddressHelper.getAddressChain(contact.address) === 'C';

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
              setContact({
                ...contact,
                name: e.target.value,
              });
            }}
            value={contact.name}
            label="Name"
            placeholder="Name"
            width="100%"
          />

          <Input
            margin="16px 0px 0px 0px"
            onChange={(e) => {
              setContact({
                ...contact,
                address: e.target.value,
              });
            }}
            value={contact.address}
            label="0x Address"
            error={!isValidAddress && contact.address.length > 0}
            errorMessage="Not a valid 0x address"
            placeholder="0x Address"
            width="100%"
          />
        </VerticalFlex>

        <VerticalFlex align="center" grow="1" justify="flex-end" margin="16px">
          <PrimaryButton
            width="100%"
            size={ComponentSize.LARGE}
            onClick={() => {
              addContact(contact);
              toast.success('Contact created!');
              goBack();
            }}
            margin="0 0 24px"
            disabled={
              contact.name?.length === 0 ||
              contact.address?.length === 0 ||
              !isValidAddress
            }
          >
            Add Contact
          </PrimaryButton>
        </VerticalFlex>
      </Scrollbars>
    </VerticalFlex>
  );
}
