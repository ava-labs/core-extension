import {
  Card,
  Divider,
  ExternalLinkIcon,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { PchainTxHistoryItem } from '@src/background/services/history/models';
import { PrimaryNetworkMethodIcon } from './PrimaryNetworkMethodIcon';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { PChainTransactionType } from '@avalabs/glacier-sdk';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { truncateAddress } from '@avalabs/core-utils-sdk';

export interface PchainActivityCardProp {
  historyItem: PchainTxHistoryItem;
}

export function PchainActivityCard({ historyItem }: PchainActivityCardProp) {
  const theme = useTheme();
  const { network } = useNetworkContext();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const txTitle = useMemo(() => {
    if (network) {
      switch (historyItem.txType) {
        case PChainTransactionType.ADD_DELEGATOR_TX:
          return t('Add Delegator');
        case PChainTransactionType.ADD_SUBNET_VALIDATOR_TX:
          return t('Add Subnet Validator');
        case PChainTransactionType.ADD_PERMISSIONLESS_VALIDATOR_TX:
          return t('Add Permissionless Validator');
        case PChainTransactionType.ADD_PERMISSIONLESS_DELEGATOR_TX:
          return t('Add Permissionless Delegator');
        case PChainTransactionType.ADD_VALIDATOR_TX:
          return t('Add Validator');
        case PChainTransactionType.ADVANCE_TIME_TX:
          return t('Advance Time');
        case PChainTransactionType.BASE_TX:
          return t('BaseTx');
        case PChainTransactionType.CREATE_CHAIN_TX:
          return t('Create Chain');
        case PChainTransactionType.CREATE_SUBNET_TX:
          return t('Create Subnet');
        case PChainTransactionType.EXPORT_TX:
          return t('Export');
        case PChainTransactionType.IMPORT_TX:
          return t('Import');
        case PChainTransactionType.REWARD_VALIDATOR_TX:
          return t('Reward Validator');
        case PChainTransactionType.REMOVE_SUBNET_VALIDATOR_TX:
          return t('Remove Subnet Validator');
        case PChainTransactionType.TRANSFER_SUBNET_OWNERSHIP_TX:
          return t('Transfer Subnet Ownership');
        case PChainTransactionType.TRANSFORM_SUBNET_TX:
          return t('Transform Subnet');
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
      data-testid={historyItem.txType + '-activity-card'}
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
              <PrimaryNetworkMethodIcon methodName={historyItem.txType} />
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
                      {historyItem.tokens[0]?.amount}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.primary.dark }}
                    >
                      {historyItem.tokens[0]?.symbol}
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
                    {Array.isArray(txAddressesToShow) &&
                      Array.from(txAddressesToShow).map((address, i) => (
                        <Typography
                          key={`${address}-${i}`}
                          variant="caption"
                          sx={{ color: theme.palette.primary.dark }}
                        >
                          {truncateAddress(address)}
                        </Typography>
                      ))}

                    {!Array.isArray(txAddressesToShow) && (
                      <Typography
                        key={`${txAddressesToShow}`}
                        variant="caption"
                        sx={{ color: theme.palette.primary.dark }}
                      >
                        {truncateAddress(txAddressesToShow)}
                      </Typography>
                    )}
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
                capture('PchainActivityCardLinkClicked', {
                  chainId: network?.chainId,
                  type: historyItem.txType,
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
