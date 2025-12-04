import { Button, Stack, toast } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountsContext } from '@core/ui';
import AddIcon from '@/components/AddIcon';

export const AddAccountButton: FC = () => {
  const { t } = useTranslation();

  const { addAccount, selectAccount } = useAccountsContext();
  return (
    <Stack marginTop={1} alignItems="center" justifyContent="center">
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() =>
          addAccount()
            .then(selectAccount)
            .then(() => {
              toast.success(t('Account created successfully'));
            })
            .catch((error) => {
              toast.error(t('Account creation failed'));
              console.error(error);
            })
        }
      >
        <AddIcon size={12} />
        {t('Add account')}
      </Button>
    </Stack>
  );
};
