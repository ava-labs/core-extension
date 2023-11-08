import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { StyledNumberList } from '@src/components/common/StyledNumberList';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  ExternalLinkIcon,
  RemoteIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { useHistory } from 'react-router-dom';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import { useLanguage } from '@src/hooks/useLanguages';
import { TypographyLink } from '../../components/TypographyLink';

export function LedgerTrouble() {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const { currentLanguage } = useLanguage();

  return (
    <Stack
      sx={{
        width: '390px',
        height: '100%',
        mt: 4,
      }}
    >
      <OnboardingStepHeader
        testId="ledger-trouble"
        title={t('Trouble Connecting')}
      />
      <Stack
        sx={{
          flexGrow: 1,
          pt: 1,
          textAlign: 'center',
        }}
      >
        <Stack sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t("We're having trouble connecting to your device.")}
          </Typography>
        </Stack>
        <Stack>
          <Stack sx={{ alignItems: 'center', mt: 4, mb: 3 }}>
            <RemoteIcon size={88} />
          </Stack>

          <Stack sx={{ mt: 1.5, width: '100%', alignItems: 'center' }}>
            <Stack
              sx={{
                width: '100%',
                rowGap: 2,
              }}
            >
              <Stack
                sx={{
                  flexDirection: 'row',
                }}
              >
                <StyledNumberList>{t('1.')}</StyledNumberList>
                <Typography variant="body2">
                  {t('Connect the Ledger device to your computer.')}
                </Typography>
              </Stack>
              <Stack
                sx={{
                  flexDirection: 'row',
                }}
              >
                <StyledNumberList>{t('2.')}</StyledNumberList>
                <Typography variant="body2">{t('Enter your PIN.')}</Typography>
              </Stack>

              <Stack
                sx={{
                  flexDirection: 'row',
                }}
              >
                <StyledNumberList>{t('3.')}</StyledNumberList>
                <Typography variant="body2">
                  <Trans
                    i18nKey="Ensure you have installed the latest <typography>Avalanche App</typography> and open it on your device."
                    components={{
                      typography: (
                        <Typography
                          as="span"
                          sx={{
                            fontWeight: 'bold',
                          }}
                        />
                      ),
                    }}
                  />
                </Typography>
              </Stack>

              <Divider flexItem style={{ margin: `${theme.spacing(1)} 0` }} />

              <Typography variant="body2">
                <Trans
                  i18nKey="If you do not have the latest Avalanche App, please add it through the <ledgerLink>Ledger Live</ledgerLink> app manager."
                  components={{
                    ledgerLink: (
                      <TypographyLink
                        as="a"
                        href="https://www.ledger.com/ledger-live"
                        target="_blank"
                        rel="noreferrer"
                        variant="body2"
                      />
                    ),
                  }}
                />
              </Typography>
              <Typography variant="body2">
                <Trans
                  i18nKey="More instructions can be found <ledgerLink>here</ledgerLink>."
                  components={{
                    ledgerLink: (
                      <TypographyLink
                        as="a"
                        href="https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                      />
                    ),
                  }}
                />
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          width: '100%',
          justifyItems: 'space-between',
          alignContent: 'center',
          my: 3,
          rowGap: theme.spacing(2),
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            columnGap: 2,
          }}
        >
          <Button
            color="secondary"
            data-testid="page-nav-back-button"
            onClick={() => {
              history.goBack();
            }}
            sx={{
              width: theme.spacing(21),
            }}
          >
            {t('Back')}
          </Button>
          <Button
            data-testid="page-nav-next-button"
            onClick={() => {
              history.push(OnboardingURLs.ONBOARDING_HOME);
            }}
            sx={{
              width: theme.spacing(21),
            }}
          >
            {t('Cancel')}
          </Button>
        </Stack>
        <Stack sx={{ justifyContent: 'center', flexDirection: 'row' }}>
          <TypographyLink
            as="a"
            href={`https://support.ledger.com/hc/${
              currentLanguage?.code || 'en-us'
            }/categories/4404376139409?docs=true`}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
          >
            {t('Ledger Live Support')}
          </TypographyLink>
          <ExternalLinkIcon
            size={16}
            sx={{ color: 'secondary.main', marginLeft: 1 }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
