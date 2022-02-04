import { useState } from 'react';
import {
  toast,
  VerticalFlex,
  Input,
  PrimaryButton,
  ComponentSize,
  TextArea,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { AddressHelper } from '@avalabs/avalanche-wallet-sdk';
import { Contact } from '@src/background/services/contacts/models';

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

export function AddContact({ goBack, navigateTo, width }: SettingsPageProps) {
  const [contact, setContact] = useState<Contact>({
    id: '',
    name: '',
    address: '',
  });
  const theme = useTheme();
  const { createContact } = useContactsContext();
  const isValidAddress =
    AddressHelper.validateAddress(contact.address) &&
    AddressHelper.getAddressChain(contact.address) === 'C';

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'New contact'}
      />
      <FlexScrollbars>
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

          <TextArea
            size={ComponentSize.SMALL}
            margin="16px 0px 0px 0px"
            onChange={(e) => {
              setContact({
                ...contact,
                address: e.target.value,
              });
            }}
            value={contact.address}
            label="Address"
            error={!isValidAddress && contact.address.length > 0}
            errorMessage={
              !isValidAddress && contact.address.length > 0
                ? 'Not a valid 0x address'
                : undefined
            }
            placeholder="Enter the address"
            width="100%"
          />
        </VerticalFlex>

        <VerticalFlex align="center" grow="1" justify="flex-end" margin="16px">
          <PrimaryButton
            width="100%"
            size={ComponentSize.MEDIUM}
            onClick={() => {
              createContact(contact);
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
            Save
          </PrimaryButton>
        </VerticalFlex>
      </FlexScrollbars>
    </VerticalFlex>
  );
}
