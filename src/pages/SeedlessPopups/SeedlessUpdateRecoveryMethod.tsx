import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircleIcon,
  Button,
  CheckCircleIcon,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@avalabs/core-k2-components';

import { useSeedlessMfa } from '@src/hooks/useSeedlessMfa';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { SecretType } from '@src/background/services/secrets/models';
import { useKeyboardShortcuts } from '@src/hooks/useKeyboardShortcuts';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { AddFidoDeviceHandler } from '@src/background/services/seedless/handlers/addFidoDevice';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { KeyType } from '@src/utils/seedless/fido/types';
import { useQueryParams } from '@src/hooks/useQueryParams';
import { AuthenticatorDetails } from '@src/components/settings/pages/RecoveryMethods/AuthenticatorDetails';

enum State {
  Loading = 'loading',
  IncompatibleWallet = 'incompatible-wallet',
  NameYourDevice = 'name-your-device',
  AddAuthenticator = 'add-authenticator',
  Success = 'success',
  Failure = 'failure',
}

export const SeedlessUpdateRecoveryMethod = () => {
  const { t } = useTranslation();
  const params = useQueryParams();
  const { request } = useConnectionContext();
  const { walletDetails } = useWalletContext();
  const { renderMfaPrompt } = useSeedlessMfa();
  const [state, setState] = useState(State.Loading);
  const [name, setName] = useState('');
  const keyType = params.get('keyType') as KeyType | null;

  useEffect(() => {
    if (walletDetails?.type !== SecretType.Seedless) {
      setState(State.IncompatibleWallet);
      return;
    }

    if (keyType) {
      setState(State.NameYourDevice);
    } else {
      setState(State.AddAuthenticator);
    }
  }, [keyType, walletDetails?.type]);

  const addFidoDevice = useCallback(async () => {
    try {
      if (!keyType) {
        return;
      }

      setState(State.Loading);

      await request<AddFidoDeviceHandler>({
        method: ExtensionRequest.SEEDLESS_ADD_FIDO_DEVICE,
        params: [name, keyType],
      });

      setState(State.Success);
    } catch (_err) {
      setState(State.Failure);
    }
  }, [request, keyType, name]);

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: addFidoDevice,
  });

  return (
    <Stack
      sx={{
        width: 375,
        height: 600,
        px: 2,
        backgroundColor: 'background.paper',
        alignSelf: 'center',
        borderRadius: 1,
        pb: 3,
      }}
    >
      {state === State.Failure && (
        <Stack
          sx={{
            width: 1,
            height: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            px: 3,
          }}
        >
          <AlertCircleIcon size={72} />
          <Stack sx={{ textAlign: 'center', gap: 0.5 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {t('Something Went Wrong')}
            </Typography>
            <Typography variant="body2">
              {t('We encountered an unexpected issue.')}
            </Typography>
            <Typography variant="body2">{t('Please try again.')}</Typography>
          </Stack>

          <Button
            fullWidth
            sx={{ mt: 4 }}
            onClick={addFidoDevice}
            data-testid="btn-try-again"
          >
            {t('Try again')}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={window.close}
            data-testid="btn-close"
          >
            {t('Close')}
          </Button>
        </Stack>
      )}
      {state === State.Success && (
        <Stack
          sx={{
            width: 1,
            height: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            px: 2,
            textAlign: 'center',
          }}
        >
          <CheckCircleIcon size={72} sx={{ color: 'success.main' }} />
          <Typography variant="h5">{t('Success!')}</Typography>
          <Typography variant="body2">
            {t('You can now use your new {{methodName}} to verify requests.', {
              methodName:
                keyType === KeyType.Yubikey
                  ? t('Yubikey')
                  : keyType === KeyType.Passkey
                    ? t('Passkey')
                    : t('Authenticator app'),
            })}
          </Typography>

          <Button
            fullWidth
            onClick={window.close}
            data-testid="btn-close"
            sx={{ mt: 3 }}
          >
            {t('Close')}
          </Button>
        </Stack>
      )}
      {state === State.IncompatibleWallet && (
        <Stack
          sx={{
            width: 1,
            height: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <AlertCircleIcon size={72}></AlertCircleIcon>
          <Typography variant="h5">{t('Incompatible Wallet')}</Typography>
          <Typography variant="body2">
            {t('This action is only allowed for Seedless wallets.')}
          </Typography>
        </Stack>
      )}
      {state === State.Loading && (
        <>
          <PageTitle
            showBackButton={false}
            variant={PageTitleVariant.PRIMARY}
            margin="0 0 0 -16px"
          >
            {keyType === KeyType.Yubikey
              ? t('Yubikey Setup')
              : keyType === KeyType.Passkey
                ? t('Passkey Setup')
                : t('Authenticator Setup')}
          </PageTitle>
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <CircularProgress size={72} />
          </Stack>
          {renderMfaPrompt()}
        </>
      )}
      {keyType && state === State.NameYourDevice && (
        <>
          <PageTitle
            showBackButton={false}
            variant={PageTitleVariant.PRIMARY}
            margin="0 0 0 -16px"
          >
            {keyType === KeyType.Yubikey
              ? t('Name Your Yubikey')
              : t('Name Your Passkey')}
          </PageTitle>
          <Stack sx={{ flexGrow: 1 }}>
            <TextField
              size="large"
              autoFocus
              data-testid="fido-device-name"
              fullWidth
              label={
                keyType === KeyType.Yubikey
                  ? t('Yubikey Name')
                  : t('Passkey Name')
              }
              inputLabelProps={{
                sx: {
                  transform: 'none',
                  fontSize: 'body2.fontSize',
                  mb: 1,
                  mt: 4,
                },
              }}
              helperText={t(
                'Add a {{device}} name, so that it’s easier to find later.',
                {
                  device:
                    keyType === KeyType.Yubikey ? t('Yubikey') : t('Passkey'),
                },
              )}
              placeholder={
                keyType === KeyType.Yubikey ? t('My Yubikey') : t('My Passkey')
              }
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              {...keyboardHandlers}
            />
          </Stack>
          <Button
            fullWidth
            size="large"
            onClick={addFidoDevice}
            disabled={!name}
          >
            {t('Save')}
          </Button>
        </>
      )}
      {!keyType && state === State.AddAuthenticator && (
        <AuthenticatorDetails
          autoInitialize
          onUpdated={() => setState(State.Success)}
          onBackClick={window.close}
        />
      )}
    </Stack>
  );
};
