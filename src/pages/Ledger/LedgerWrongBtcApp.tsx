import { LedgerNano } from '@src/components/common/LedgerNano';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Link,
  Stack,
  Typography,
  useTheme,
  XIcon,
} from '@avalabs/k2-components';

export function LedgerWrongBtcApp({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Card
      sx={{
        p: theme.spacing(2),
        width: theme.spacing(43),
      }}
      className={className}
    >
      <Stack
        sx={{
          alignItems: 'center',
          rowGap: 3,
        }}
      >
        <Stack sx={{ width: '100%', rowGap: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Typography variant="h5" sx={{ pt: 1 }}>
              {t('Legacy App Required')}
            </Typography>
            <Button
              variant="text"
              onClick={() => onClose?.()}
              sx={{ height: 14, minWidth: 14, p: 0 }}
              disableRipple
            >
              <XIcon
                size={24}
                sx={{
                  color: 'primary.main',
                }}
              />
            </Button>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              width: 287,
              color: theme.palette.grey[400],
            }}
          >
            <Trans
              i18nKey="Please use the Bitcoin Legacy application on your Ledger device to continue. <br> Learn more <ledgerLink>here</ledgerLink>."
              components={{
                ledgerLink: (
                  <Link
                    underline="none"
                    sx={{
                      color: 'secondary.main',
                    }}
                    target="_blank"
                    href="https://support.avax.network/en/articles/7053882-using-core-with-the-bitcoin-legacy-ledger-application"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            />
          </Typography>
        </Stack>

        <LedgerNano />
        <Typography variant="body2" sx={{ mb: 1 }}>
          <Trans
            i18nKey="Download <ledgerLink>Ledger Live</ledgerLink> to install."
            components={{
              ledgerLink: (
                <Typography
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 'semibold',
                    color: 'secondary.main',
                  }}
                  as="a"
                  target="_blank"
                  href="https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        </Typography>
      </Stack>
    </Card>
  );
}
