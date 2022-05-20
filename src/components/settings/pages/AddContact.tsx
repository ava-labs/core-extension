import { useState } from 'react';
import { toast, VerticalFlex, TextButton } from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { Contact } from '@src/background/services/contacts/models';
import { ContactForm } from '../components/ContactForm';

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
    addressBTC: '',
  });

  const theme = useTheme();
  const { createContact } = useContactsContext();
  const [isFormValid, setIsFormValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const handleChange = (contact: Contact, formValid: boolean) => {
    setContact({
      ...contact,
    });
    setIsFormValid(formValid);
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
              setShowErrors(true);
              if (!isFormValid) {
                return;
              }
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
        <VerticalFlex padding="0 16px">
          <ContactForm
            contact={contact}
            handleChange={handleChange}
            showErrors={showErrors}
            autoFocus={true}
          />
        </VerticalFlex>
      </FlexScrollbars>
    </VerticalFlex>
  );
}
