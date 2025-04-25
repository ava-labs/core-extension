import { StyledNumberList } from '@/components/common/StyledNumberList';
import { Trans, useTranslation } from 'react-i18next';
import {
  Divider,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { TypographyLink } from '../../pages/Onboarding/components/TypographyLink';

export enum LedgerTroubleStepsFontVariant {
  small = 'body1',
  large = 'body2',
}

export function LedgerTroubleSteps({
  fontVariant = LedgerTroubleStepsFontVariant.small,
  sx = {},
}: {
  fontVariant?: LedgerTroubleStepsFontVariant;
  sx?: SxProps;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack sx={{ ...sx, width: '100%' }}>
      <Stack
        sx={{
          rowGap: 2,
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
          }}
        >
          <StyledNumberList>{t('1.')}</StyledNumberList>
          <Typography variant={fontVariant}>
            {t('Connect the Ledger device to your computer.')}
          </Typography>
        </Stack>
        <Stack
          sx={{
            flexDirection: 'row',
          }}
        >
          <StyledNumberList>{t('2.')}</StyledNumberList>
          <Typography variant={fontVariant}>{t('Enter your PIN.')}</Typography>
        </Stack>

        <Stack
          sx={{
            flexDirection: 'row',
          }}
        >
          <StyledNumberList>{t('3.')}</StyledNumberList>
          <Typography variant={fontVariant}>
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

        <Typography variant={fontVariant}>
          <Trans
            i18nKey="If you do not have the latest Avalanche App, please add it through the <ledgerLink>Ledger Live</ledgerLink> app manager."
            components={{
              ledgerLink: (
                <TypographyLink
                  as="a"
                  href="https://www.ledger.com/ledger-live"
                  target="_blank"
                  rel="noreferrer"
                  variant={fontVariant}
                />
              ),
            }}
          />
        </Typography>
        <Typography variant={fontVariant}>
          <Trans
            i18nKey="More instructions can be found <ledgerLink>here</ledgerLink>."
            components={{
              ledgerLink: (
                <TypographyLink
                  as="a"
                  href="https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={fontVariant}
                />
              ),
            }}
          />
        </Typography>
      </Stack>
    </Stack>
  );
}
