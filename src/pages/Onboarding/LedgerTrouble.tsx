import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { StyledNumberList } from '@src/components/common/StyledNumberList';
import { Trans, useTranslation } from 'react-i18next';
import { Divider, Stack, Typography, useTheme } from '@avalabs/k2-components';

interface LedgerTroubleProps {
  onBack(): void;
}

export function LedgerTrouble({ onBack }: LedgerTroubleProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="ledger-trouble"
        title={t('Trouble Connecting')}
        onClose={onBack}
      />
      <Stack
        sx={{
          width: '100%',
          px: 6,
        }}
      >
        <Stack sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t("We're having trouble connecting to your device.")}
          </Typography>
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
                    <Typography
                      as="a"
                      href="https://www.ledger.com/ledger-live"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{
                        cursor: 'pointer',
                        color: 'secondary.main',
                        fontWeight: 'semibold',
                      }}
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
                    <Typography
                      as="a"
                      href="https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{
                        cursor: 'pointer',
                        color: 'secondary.main',
                        fontWeight: 'semibold',
                      }}
                    />
                  ),
                }}
              />
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
