import { useState } from 'react';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import type { Contact } from '@avalabs/types';
import { ContactForm } from '../components/ContactForm';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Stack,
  Scrollbars,
  styled,
  toast,
} from '@avalabs/k2-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

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

  const { createContact } = useContactsContext();
  const { capture } = useAnalyticsContext();
  const [isFormValid, setIsFormValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const handleChange = (contact: Contact, formValid: boolean) => {
    setContact({
      ...contact,
    });
    setIsFormValid(formValid);
  };

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('New Contact')}
        action={
          <Button
            variant="text"
            color="secondary"
            data-testid="add-new-contact-button"
            onClick={() => {
              setShowErrors(true);
              if (!isFormValid) {
                return;
              }
              toast.promise(
                (async () => {
                  try {
                    const res = await createContact(contact);
                    capture('AddContactSucceeded');
                    return res;
                  } catch (err) {
                    capture('AddContactFailed');
                    throw err;
                  }
                })(),
                {
                  loading: t('creating...'),
                  success: t('Contact created!'),
                  error: t('Something went wrong'),
                },
                {
                  success: {
                    duration: 2000,
                  },
                }
              );
              goBack();
            }}
          >
            {t('Save')}
          </Button>
        }
      />
      <FlexScrollbars>
        <Stack sx={{ px: 2 }}>
          <ContactForm
            contact={contact}
            handleChange={handleChange}
            showErrors={showErrors}
            autoFocus={true}
          />
        </Stack>
      </FlexScrollbars>
    </Stack>
  );
}
