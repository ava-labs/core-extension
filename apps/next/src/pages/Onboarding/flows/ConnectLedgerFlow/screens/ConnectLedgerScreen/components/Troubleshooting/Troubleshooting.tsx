import { FC, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  Stack,
  StackProps,
  Typography,
} from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';
import { InTextLink } from '@/components/InTextLink';
import { CardMenu } from '@/pages/Onboarding/components/CardMenu';

import { InfoBox } from './InfoBox';

type TroubleshootingProps = StackProps & {
  onClose: () => void;
  appName: string;
};
export const Troubleshooting: FC<TroubleshootingProps> = ({
  appName,
  onClose,
  ...stackProps
}) => {
  const { t } = useTranslation();
  const { setOnBackHandler } = useModalPageControl();

  useEffect(() => {
    setOnBackHandler(() => onClose);

    return () => {
      setOnBackHandler(undefined);
    };
  }, [onClose, setOnBackHandler]);

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <OnboardingStepTitle>{t('Trouble connecting')}</OnboardingStepTitle>
      <OnboardingStepContent>
        <InfoBox appName={appName} width="80%">
          <Typography variant="body2">
            <Trans
              i18nKey="If you do not have the latest {{appName}} app, please add it through the <ledgerLiveLink>Ledger Live</ledgerLiveLink> app manager."
              values={{ appName }}
              components={{
                ledgerLiveLink: (
                  <InTextLink
                    sx={{ ml: 0.5 }}
                    target="_blank"
                    href="https://www.ledger.com/ledger-live"
                    rel="noreferrer"
                  />
                ),
              }}
            />
          </Typography>
        </InfoBox>
        <CardMenu sx={{ width: 1, flex: '0 0 auto', py: 2 }} as="ol">
          <li>
            <Typography variant="body2">
              {t('Connect the Ledger device to your computer')}
            </Typography>
          </li>
          <Divider sx={{ my: 2, ml: -2, mr: 2 }} />
          <li>
            <Typography variant="body2">
              {t('Enter your PIN on your Ledger')}
            </Typography>
          </li>
          <Divider sx={{ my: 2, ml: -2, mr: 2 }} />
          <li>
            <Typography variant="body2">
              {t(
                'Ensure you have installed the latest {{appName}} app and open it on your device',
                { appName },
              )}
            </Typography>
          </li>
        </CardMenu>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <Button
          sx={{ minWidth: 150, alignSelf: 'flex-end' }}
          // disabled={!isValid}
          variant="contained"
          color="primary"
          onClick={onClose}
        >
          {t('Close')}
        </Button>
      </OnboardingStepActions>
    </Stack>
  );
};
