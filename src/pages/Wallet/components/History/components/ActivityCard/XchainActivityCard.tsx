import {
  Card,
  Divider,
  ExternalLinkIcon,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { XchainTxHistoryItem } from '@src/background/services/history/models';
import { PrimaryNetworkMethodIcon } from './PrimaryNetworkMethodIcon';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { XChainTransactionType } from '@avalabs/glacier-sdk';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { truncateAddress } from '@avalabs/utils-sdk';

export interface XchainActivityCardProp {
  historyItem: XchainTxHistoryItem;
}

export function XchainActivityCard({ historyItem }: XchainActivityCardProp) {
  const theme = useTheme();
  const { network } = useNetworkContext();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const txTitle = useMemo(() => {
    if (network) {
      switch (historyItem.type) {
        case XChainTransactionType.BASE_TX:
          return t('BaseTx');
        case XChainTransactionType.CREATE_ASSET_TX:
          return t('Create Asset');
        case XChainTransactionType.OPERATION_TX:
          return t('Operation');
        case XChainTransactionType.IMPORT_TX:
          return t('Import');
        case XChainTransactionType.EXPORT_TX:
          return t('Export');
        default:
          return t('Unknown');
      }
    }
  }, [network, t, historyItem]);

  const txDirection = historyItem.isSender ? t('To') : t('From');
  const txAddressesToShow = historyItem.isSender
    ? historyItem.to
    : historyItem.from;

  return (
    <Card
      data-testid={historyItem.type + '-activity-card'}
      sx={{ p: 2, backgroundImage: 'none' }}
    >
      <Stack
        divider={
          <Divider
            orientation="vertical"
            flexItem
            style={{
              borderBottomWidth: 1,
            }}
          />
        }
        sx={{ rowGap: 1.5, width: '100%' }}
      >
        <Stack
          sx={{
            cursor: 'default',
          }}
        >
          <Stack>
            <Stack
              sx={{
                flexDirection: 'row',
                columnGap: 2,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <PrimaryNetworkMethodIcon methodName={historyItem.type} />
              <Stack sx={{ rowGap: 0.5 }}>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: theme.spacing(32),
                  }}
                >
                  <Typography variant="h6">{txTitle}</Typography>
                  <Stack sx={{ flexDirection: 'row', columnGap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'fontWeightSemibold' }}
                    >
                      {historyItem.token.amount}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.primary.dark }}
                    >
                      {historyItem.token.symbol}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    columnGap: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.primary.dark }}
                  >
                    {txDirection}:
                  </Typography>
                  <Stack>
                    {Array.from(txAddressesToShow).map((address, i) => (
                      <Typography
                        key={`${address}-${i}`}
                        variant="caption"
                        sx={{ color: theme.palette.primary.dark }}
                      >
                        {truncateAddress(address)}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography>{t('Network Fee')}</Typography>
          <Tooltip title={t('View in Explorer')} arrow>
            <Stack
              sx={{
                flexDirection: 'row',
                columnGap: 0.5,
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={async () => {
                capture('XchainActivityCardLinkClicked', {
                  chainId: network?.chainId,
                  type: historyItem.type,
                });
                window.open(historyItem.explorerLink, '_blank', 'noreferrer');
              }}
              data-testid="explorer-link"
            >
              <Typography>{historyItem.gasUsed}</Typography>
              <Typography>{network?.networkToken.symbol}</Typography>
              <ExternalLinkIcon
                size={16}
                sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
              />
            </Stack>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
