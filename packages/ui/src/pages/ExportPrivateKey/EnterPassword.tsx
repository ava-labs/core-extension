import {
  Button,
  KeyIcon,
  Stack,
  TextField,
  Typography,
  styled,
} from '@avalabs/core-k2-components';
import {
  AccountType,
  PrivateKeyChain,
} from '@core/service-worker';
import { SecretType } from '@core/service-worker';
import { Dropdown, DropdownItem } from '@/components/common/Dropdown';
import { PageTitle } from '@/components/common/PageTitle';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useGoBack } from '@/hooks/useGoBack';

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
  accountType: SecretType.Mnemonic | AccountType.IMPORTED | null;
  onSubmit: (password: string, chain: PrivateKeyChain) => void;
  isLoading: boolean;
  errorMessage?: string;
}

export function EnterPassword({
  accountType,
  errorMessage,
  isLoading,
  onSubmit,
}: EnterPassword) {
  const history = useHistory();
  const goBack = useGoBack('/accounts');
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const [privateKeyChain, setPrivateKeyChain] = useState<PrivateKeyChain>(
    PrivateKeyChain.C,
  );
  const [password, setPassword] = useState('');

  return (
    <>
      <Stack>
        <PageTitle
          margin={'22px 0 4px 0'}
          onBackClick={() => {
            capture('ExportPrivateKeyCancelled');
            goBack();
          }}
        >
          {t('Enter Password')}
        </PageTitle>
        <Stack sx={{ alignItems: 'center' }}>
          <IconWrapper>
            <KeyIcon size={32} />
          </IconWrapper>
        </Stack>
        {accountType === SecretType.Mnemonic && (
          <Stack sx={{ px: 2, mt: 3 }}>
            <Dropdown
              SelectProps={{
                defaultValue: PrivateKeyChain.C,
                native: false,
                displayEmpty: false,
                renderValue: () => {
                  switch (privateKeyChain) {
                    case PrivateKeyChain.C:
                      return <Typography>{t('C-Chain')}</Typography>;
                    case PrivateKeyChain.XP:
                      return <Typography>{t('X/P-Chain')}</Typography>;
                  }
                },
                onChange: (e) => {
                  const chain = e.target.value;
                  if (chain && chain !== privateKeyChain) {
                    setPrivateKeyChain(chain as PrivateKeyChain);
                  }
                },
                // We need the @ts-ignore, because MUI's "nested props" (such as SelectProps)
                // do not allow passing data-attributes.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                'data-testid': 'private-key-chain-dropdown',
              }}
              label={t('Select chain')}
            >
              <DropdownItem
                value={PrivateKeyChain.C}
                selected={privateKeyChain === PrivateKeyChain.C}
                data-testid="private-key-chain-dropdown-item-c"
              >
                <Typography>{t('C-Chain')}</Typography>
              </DropdownItem>
              <DropdownItem
                value={PrivateKeyChain.XP}
                selected={privateKeyChain === PrivateKeyChain.XP}
                data-testid="private-key-chain-dropdown-item-xp"
              >
                <Typography>{t('X/P-Chain')}</Typography>
              </DropdownItem>
            </Dropdown>
          </Stack>
        )}
        <Stack sx={{ px: 2, mt: 2 }}>
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
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSubmit(password, privateKeyChain);
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
            onClick={() => {
              capture('ExportPrivateKeyCancelled');
              history.replace('/accounts');
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            color="primary"
            size="large"
            onClick={() => {
              onSubmit(password, privateKeyChain);
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
