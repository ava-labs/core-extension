import { satoshiToBtc } from '@avalabs/bridge-sdk';
import {
  Card,
  ChevronDownIcon,
  ChevronUpIcon,
  Divider,
  ExternalLinkIcon,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { weiToAvax } from '@avalabs/utils-sdk';
import { isNFT } from '@src/background/services/balances/nft/utils/isNFT';
import {
  TransactionType,
  TxHistoryItem,
} from '@src/background/services/history/models';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import Big from 'big.js';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityCardAmount } from './ActivityCardAmount';
import { ActivityCardDetails } from './ActivityCardDetails';
import { ActivityCardIcon } from './ActivityCardIcon';
import { ActivityCardSummary } from './ActivityCardSummary';

export interface ActivityCardProp {
  historyItem: TxHistoryItem;
}

export function ActivityCard({ historyItem }: ActivityCardProp) {
  const { network } = useNetworkContext();
  const [showDetails, setShowDetails] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();
  const { capture } = useAnalyticsContext();

  const showDetailsOption = useMemo(() => {
    if (
      historyItem.type === TransactionType.SWAP ||
      historyItem.type === TransactionType.NFT_BUY ||
      (historyItem.type === TransactionType.TRANSFER &&
        historyItem.tokens[0] &&
        isNFT(historyItem.tokens[0].type))
    ) {
      return true;
    }
    return false;
  }, [historyItem]);

  const gasDisplayAmount = useMemo(() => {
    if (network && isBitcoinNetwork(network)) {
      return satoshiToBtc(Number(historyItem.gasUsed)).toFixed(6).toString();
    }
    return weiToAvax(
      new Big(
        Number(historyItem.gasUsed) *
          Number(historyItem.gasPrice === undefined ? 1 : historyItem.gasPrice)
      )
    )
      .toFixed(6)
      .toString();
  }, [network, historyItem]);

  const optionalDetailsButton = useMemo(() => {
    if (showDetailsOption) {
      if (showDetails) {
        return <ChevronUpIcon />;
      } else {
        return <ChevronDownIcon />;
      }
    } else {
      return undefined;
    }
  }, [showDetailsOption, showDetails]);

  const txTitle = useMemo(() => {
    if (network) {
      switch (historyItem.type) {
        case TransactionType.BRIDGE:
          return t('Bridge');
        case TransactionType.SWAP:
          return t('Swap');
        case TransactionType.SEND:
          return t('Sent');
        case TransactionType.RECEIVE:
          return t('Received');
        case TransactionType.NFT_BUY:
          return t('NFT Buy');
        case TransactionType.TRANSFER:
          if (historyItem.tokens[0] && isNFT(historyItem.tokens[0]?.type)) {
            return historyItem.isSender ? t('NFT Sent') : t('NFT Received');
          } else {
            return t('Transfer');
          }
        default:
          if (historyItem.isContractCall) {
            return t('Contract Call');
          }
          return historyItem.tokens[0]?.symbol;
      }
    }
  }, [network, t, historyItem]);

  return (
    <Card
      data-testid={
        historyItem.isContractCall
          ? 'Contract-call-activity-card'
          : historyItem.type + '-activity-card'
      }
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
            cursor: showDetailsOption ? 'pointer' : 'default',
          }}
          onClick={() => {
            const isToggledOnNow = !showDetails;
            if (showDetailsOption) {
              if (isToggledOnNow) {
                // We only want to know when it's being shown
                capture('ActivityCardDetailShown', {
                  chainId: network?.chainId,
                  type: historyItem.type,
                });
              }
              setShowDetails(isToggledOnNow);
            }
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
              <ActivityCardIcon historyItem={historyItem} />
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
                  <ActivityCardAmount historyItem={historyItem} />
                </Stack>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <ActivityCardSummary historyItem={historyItem} />
                  {optionalDetailsButton}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          {showDetails && <ActivityCardDetails historyItem={historyItem} />}
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
              sx={{ flexDirection: 'row', columnGap: 0.5, cursor: 'pointer' }}
              onClick={async () => {
                await capture('ActivityCardLinkClicked', {
                  chainId: network?.chainId,
                  type: historyItem.type,
                });
                window.open(historyItem.explorerLink, '_blank', 'noreferrer');
              }}
              data-testid="explorer-link"
            >
              <Typography>{gasDisplayAmount}</Typography>
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
