import { LedgerNano } from '@src/components/common/LedgerNano';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Stack,
  Typography,
  useTheme,
  XIcon,
} from '@avalabs/k2-components';

export function LedgerWrongVersion({
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
        }}
      >
        <Button
          variant="text"
          onClick={() => onClose?.()}
          sx={{ alignSelf: 'flex-end' }}
        >
          <XIcon
            sx={{
              height: 2,
              color: 'primary.main',
            }}
          />
        </Button>
        <Typography variant="h5">{t('Update Required')}</Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            pt: 1,
            pb: 4,
          }}
        >
          <Trans
            i18nKey="Please update the <typography>Avalanche Application</typography> on your Ledger device to continue."
            components={{
              typography: <Typography sx={{ fontWeight: 'semibold' }} />,
            }}
          />
        </Typography>
        <LedgerNano />
        <Typography variant="body2" sx={{ mt: 3, mb: 1 }}>
          <Trans
            i18nKey="Download <ledgerLink>Ledger Live</ledgerLink> to update."
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
