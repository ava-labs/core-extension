import {
  Button,
  KeyIcon,
  Stack,
  TextField,
  styled,
} from '@avalabs/k2-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const IconWrapper = styled(Stack)`
  background: ${({ theme }) => theme.palette.grey[850]};
  border-radius: 50%;
  border: 1px solid white;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  margin-top: 24px;
`;

interface EnterPassword {
  setPassword: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  isLoading: boolean;
  errorMessage?: string;
  password?: string;
}

export function EnterPassword({
  setPassword,
  errorMessage,
  isLoading,
  onSubmit,
  password,
}: EnterPassword) {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <>
      <Stack>
        <PageTitle
          margin={'22px 0 4px 0'}
          onBackClick={() => history.replace('/accounts')}
        >
          {t('Enter Password')}
        </PageTitle>
        <Stack sx={{ alignItems: 'center' }}>
          <IconWrapper>
            <KeyIcon size={32} />
          </IconWrapper>
        </Stack>
        <Stack sx={{ px: 2, mt: 3 }}>
          <TextField
            data-testid="password-input"
            type="password"
            label={t('Password')}
            onChange={(e) => setPassword(e.currentTarget.value.trim())}
            placeholder={t('Enter Password')}
            error={!!errorMessage}
            helperText={errorMessage}
            size="medium"
            fullWidth
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSubmit();
              }
            }}
          />
        </Stack>
      </Stack>
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Stack
          sx={{
            width: '100%',
            flexDirection: 'row',
            flexGrow: 1,
            gap: 1,
          }}
        >
          <Button
            size="large"
            data-testid="export-private-key-enter-password-cancel"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => history.replace('/accounts')}
          >
            {t('Cancel')}
          </Button>
          <Button
            color="primary"
            size="large"
            onClick={() => {
              onSubmit();
            }}
            data-testid="export-private-key-enter-password-next"
            type="primary"
            fullWidth
            variant="contained"
            disabled={!password}
            isLoading={isLoading}
          >
            {t('Next')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
