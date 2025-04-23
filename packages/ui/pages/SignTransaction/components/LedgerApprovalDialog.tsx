import { useTranslation } from 'react-i18next';
import {
  Divider,
  Typography,
  Box,
  Stack,
  CircularProgress,
  useTheme,
} from '@avalabs/core-k2-components';
import { truncateAddress } from '@core/utils';

interface LedgerApprovalDialogProps {
  address?: string;
  amount?: string;
  symbol?: string;
  fee?: string;
  feeSymbol?: string;
  header?: string;
  nftName?: string;
  currentSignature?: number;
  requiredSignatures?: number;
}

export function LedgerApprovalDialog({
  address,
  amount,
  symbol,
  fee,
  feeSymbol,
  header,
  nftName,
  currentSignature,
  requiredSignatures,
}: LedgerApprovalDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const title = header ?? t('Approve on your Ledger');

  const hasSignaturesInfo =
    typeof requiredSignatures === 'number' &&
    typeof currentSignature === 'number';

  return (
    <Stack
      sx={{
        width: '337px',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        background: theme.palette.background.paper,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Stack sx={{ width: '100%' }}>
          {address && (
            <Stack>
              <Typography
                margin="0 0 4px 0"
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                {t('To')}
              </Typography>
              <Typography variant="body1">
                {truncateAddress(address, 12)}
              </Typography>
            </Stack>
          )}
          <Divider sx={{ my: 2 }} />
          {amount && (
            <>
              <Stack>
                <Typography
                  variant="body2"
                  margin="0 0 4px 0"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {t('Amount')}
                </Typography>
                <Typography variant="body1">
                  {amount} {symbol}
                </Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
            </>
          )}
          {fee && (
            <>
              <Stack>
                <Typography
                  variant="body2"
                  margin="0 0 4px 0"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {t('Fee')}
                </Typography>
                <Typography variant="body1">
                  {fee} {feeSymbol}
                </Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
            </>
          )}
          {nftName && (
            <>
              <Stack>
                <Typography variant="body2" margin="0 0 4px 0">
                  {t('Collectible')}
                </Typography>
                <Typography variant="body1">{nftName}</Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
            </>
          )}
          {hasSignaturesInfo && (
            <>
              <Stack>
                <Typography variant="body2" margin="0 0 4px 0">
                  {t('Current signature')}
                </Typography>
                <Typography variant="body1">
                  {t('{{current}} out of {{total}}', {
                    current: currentSignature,
                    total: requiredSignatures,
                  })}
                </Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
            </>
          )}
          <Stack>
            <Typography variant="body2" margin="0 0 4px 0">
              {t('Status')}
            </Typography>
            <Stack sx={{ mt: 1, flexDirection: 'row', gap: 1 }}>
              <CircularProgress size={24} />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
