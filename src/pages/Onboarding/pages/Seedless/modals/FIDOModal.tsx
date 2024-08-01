import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  XIcon,
  useTheme,
  AlertCircleIcon,
} from '@avalabs/core-k2-components';
import { Overlay } from '@src/components/common/Overlay';
import { useSeedlessActions } from '@src/pages/Onboarding/hooks/useSeedlessActions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { FIDOSteps, RecoveryMethodTypes } from '../models';

interface SeedlessModalProps {
  onFinish: () => void;
  onCancel: () => void;
  selectedMethod: RecoveryMethodTypes;
  startingStep?: FIDOSteps;
}

export function FIDOModal({
  onFinish,
  onCancel,
  selectedMethod,
  startingStep,
}: SeedlessModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { addFIDODevice, loginWithFIDO } = useSeedlessActions();
  const { capture } = useAnalyticsContext();

  const [FIDODeviceName, setFIDODeviceName] = useState('');
  const [step, setStep] = useState<FIDOSteps>(startingStep || FIDOSteps.NAMING);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);

  const isButtonsDisabled = useMemo(() => {
    if (step === FIDOSteps.LOGIN || step === FIDOSteps.REGISTER) {
      return true;
    }
    return false;
  }, [step]);

  const login = useCallback(async () => {
    setStep(FIDOSteps.LOGIN);
    try {
      const isSuccessful = await loginWithFIDO();
      if (isSuccessful) {
        capture(`FidoDevice${selectedMethod}LoginSuccess`);
        setIsLoginSuccessful(isSuccessful);
        onFinish();
      }
    } catch (e) {
      setStep(FIDOSteps.ERROR);
      capture(`FidoDevice${selectedMethod}LoginError`);
    }
    return;
  }, [capture, loginWithFIDO, onFinish, selectedMethod]);

  useEffect(() => {
    if (startingStep === FIDOSteps.LOGIN && !isLoginSuccessful) {
      login();
    }
  }, [isLoginSuccessful, login, startingStep]);

  const addDevice = useCallback(
    async (name?: string) => {
      setStep(FIDOSteps.REGISTER);
      try {
        const deviceName = name || `${selectedMethod}-1`;
        const isFidoRegisterSuccessful = await addFIDODevice(
          deviceName,
          selectedMethod
        );
        if (!isFidoRegisterSuccessful) {
          throw new Error('Something went wrong with the device registration.');
        }
        setStep(FIDOSteps.LOGIN);
        const isFidoLoginSuccessful = await loginWithFIDO();
        if (isFidoLoginSuccessful) {
          capture(`FidoDevice${selectedMethod}Added`);
          onFinish();
        }
      } catch (e) {
        setStep(FIDOSteps.ERROR);
        capture(`FidoDevice${selectedMethod}AddError`);
      }
    },
    [addFIDODevice, capture, loginWithFIDO, onFinish, selectedMethod]
  );

  const headLines = useMemo(
    () => ({
      naming: t('Name Your {{device}}', {
        device: selectedMethod,
      }),
      register: t('{{device}} Setup', {
        device: selectedMethod,
      }),

      login: t('{{device}} Login', {
        device: selectedMethod,
      }),
      error: t('Couldn’t Connect'),
    }),
    [selectedMethod, t]
  );

  const descriptions = useMemo(
    () => ({
      naming: t('Add a {{device}} name, so that it’s easier to find later.', {
        device: selectedMethod,
      }),
      register: t(
        'You will see instructions in your browser window for adding your key to your account.'
      ),
      login: t(
        'You will see instructions in your browser window for logging in with your key.'
      ),
      error: t('The operation either timed out or was not allowed.'),
    }),
    [selectedMethod, t]
  );

  const contents = useMemo(
    () => ({
      naming: (
        <Stack sx={{ width: '100%' }}>
          <TextField
            inputProps={{ style: { width: '100%' } }}
            type="tel"
            onChange={(event) => {
              setFIDODeviceName(event.target.value);
            }}
            placeholder={t('Enter {{device}} name', {
              device: selectedMethod,
            })}
          />
        </Stack>
      ),
      register: (
        <Stack
          sx={{
            width: '100%',
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={56} />
        </Stack>
      ),
      login: (
        <Stack
          sx={{
            width: '100%',
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={56} />
        </Stack>
      ),
      error: (
        <Stack
          sx={{
            width: '100%',
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          <AlertCircleIcon size={56} />
        </Stack>
      ),
    }),
    [selectedMethod, t]
  );

  return (
    <Overlay>
      <Stack
        sx={{
          width: '512px',
          minHeight: '407px',
          background: theme.palette.background.paper,
          borderRadius: 1,
          p: 1,
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              pt: 3,
              px: 4,
              textTransform: 'capitalize',
            }}
            data-testid={`fido-modal-header`}
          >
            {headLines[step]}
          </Typography>
          <Button
            variant="text"
            data-testid={`fido-modal-close-button`}
            onClick={onCancel}
            sx={{
              p: 0,
              height: theme.spacing(3),
              width: theme.spacing(3),
              minWidth: theme.spacing(3),
            }}
          >
            <XIcon size={24} sx={{ color: 'primary.main' }} />
          </Button>
        </Stack>
        <Stack
          sx={{
            flexGrow: 1,
            pt: 1,
            px: 4,
          }}
        >
          <Typography variant="body2" minHeight={40}>
            <Typography sx={{ color: 'text.secondary' }}>
              {descriptions[step]}
            </Typography>
          </Typography>
          <Stack
            sx={{
              height: '100%',
              flexGrow: 1,
            }}
          >
            {contents[step]}
          </Stack>
        </Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent:
              step !== FIDOSteps.ERROR ? 'space-between' : 'flex-end',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Stack>
            {step !== FIDOSteps.ERROR && (
              <Button
                variant="text"
                disabled={step === FIDOSteps.REGISTER}
                onClick={async () => {
                  await addDevice();
                }}
                sx={{
                  color:
                    step === FIDOSteps.LOGIN
                      ? 'text.secondary'
                      : 'secondary.main',
                }}
                data-testid="fido-modal-naming-skip"
              >
                {t('Skip')}
              </Button>
            )}
          </Stack>

          <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
            <Button
              color="secondary"
              data-testid="fido-modal-cancel"
              disabled={isButtonsDisabled}
              onClick={() => {
                capture(`FidoDevice${selectedMethod}Cancelled`);
                onCancel();
              }}
            >
              {t('Cancel')}
            </Button>
            <Button
              isLoading={isButtonsDisabled}
              disabled={isButtonsDisabled}
              data-testid="fido-modal-advance"
              onClick={async () => {
                if (startingStep === FIDOSteps.LOGIN) {
                  await login();
                  return;
                }
                await addDevice(FIDODeviceName);
              }}
            >
              {step !== FIDOSteps.ERROR ? t('Next') : t('Try Again')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Overlay>
  );
}
