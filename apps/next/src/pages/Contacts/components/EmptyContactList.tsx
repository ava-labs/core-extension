import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';

import { getContactsPath } from '@/config/routes';

export const EmptyContactList = ({
  title,
  description,
  icon,
  filteredContacts,
}: {
  title: string;
  description: string;
  icon: string;
  filteredContacts: boolean;
}) => {
  const { t } = useTranslation();
  const { push } = useHistory();

  return (
    <Stack
      data-testid="contacts-empty-state"
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      gap={2}
      px={5}
      textAlign="center"
    >
      <span style={{ fontSize: 48, lineHeight: 1 }}>{icon}</span>
      <Stack>
        <Typography variant="subtitle3">{title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Stack>
      {!filteredContacts && (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => push(getContactsPath('add'))}
        >
          {t('Add an address')}
        </Button>
      )}
    </Stack>
  );
};
