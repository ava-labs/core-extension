import { useState } from 'react';
import {
  toast,
  VerticalFlex,
  Input,
  ComponentSize,
  TextArea,
  TextButton,
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
  const [hasAddressError, setHasAddressError] = useState(false);

  const theme = useTheme();
  const { createContact } = useContactsContext();
  const isValidAddress = (address: string) => {
    return (
      !!address.length &&
      AddressHelper.validateAddress(address) &&
      AddressHelper.getAddressChain(address) === 'C'
    );
  };

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'New Contact'}
        action={
          <TextButton
            onClick={() => {
              if (!isValidAddress(contact.address)) {
                setHasAddressError(true);
                return;
              }
              setHasAddressError(false);
              createContact(contact);
              toast.success('Contact created!');
              goBack();
            }}
          >
            Save
          </TextButton>
        }
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
            placeholder="Enter Address Name"
            width="100%"
          />

          <TextArea
            size={ComponentSize.SMALL}
            margin="24px 0px 0px"
            onChange={(e) => {
              const address = e.target.value;
              setContact({
                ...contact,
                address,
              });
            }}
            value={contact.address}
            label="Address"
            error={hasAddressError}
            errorMessage={
              hasAddressError ? 'Not a valid 0x address' : undefined
            }
            placeholder="Enter the address"
            width="100%"
          />
        </VerticalFlex>
      </FlexScrollbars>
    </VerticalFlex>
  );
}
