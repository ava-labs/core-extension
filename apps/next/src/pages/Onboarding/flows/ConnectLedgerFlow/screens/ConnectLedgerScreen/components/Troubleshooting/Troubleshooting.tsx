import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Divider,
  Stack,
  StackProps,
  styled,
  Typography,
} from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';
import { InTextLink } from '@/components/InTextLink';
import { CardMenu } from '@/pages/Onboarding/components/CardMenu';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

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
        <CardMenu sx={{ width: 1, flex: '0 0 auto', py: 2 }} component="ol">
          <li>
            <Typography variant="body2">
              {t('Connect the Ledger device to your computer')}
            </Typography>
          </li>
          <StyledDivider />
          <li>
            <Typography variant="body2">
              {t('Enter your PIN on your Ledger')}
            </Typography>
          </li>
          <StyledDivider />
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
        <NavButton color="primary" onClick={onClose}>
          {t('Close')}
        </NavButton>
      </OnboardingStepActions>
    </Stack>
  );
};

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBlock: theme.spacing(2),
  marginLeft: theme.spacing(-2),
  marginRight: theme.spacing(2),
}));
