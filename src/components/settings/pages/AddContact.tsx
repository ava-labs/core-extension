import { useState } from 'react';
import {
  toast,
  VerticalFlex,
  TextButton,
  CustomToast,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import type { Contact } from '@avalabs/types';
import { ContactForm } from '../components/ContactForm';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
        title={t('Add New Contact')}
        action={
          <TextButton
            data-testid="add-new-contact-button"
            onClick={() => {
              setShowErrors(true);
              if (!isFormValid) {
                return;
              }
              createContact(contact);
              toast.custom(<CustomToast label={t('Contact created!')} />);
              goBack();
            }}
          >
            {t('Save')}
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
