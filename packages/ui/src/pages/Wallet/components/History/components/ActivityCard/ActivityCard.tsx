import { TruncateFeeAmount } from '@/components/common/TruncateFeeAmount';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { useNetworkContext } from '@/contexts/NetworkProvider';
import { satoshiToBtc } from '@avalabs/core-bridge-sdk';
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
} from '@avalabs/core-k2-components';
import { TokenUnit, weiToAvax } from '@avalabs/core-utils-sdk';
import { TransactionType } from '@avalabs/vm-module-types';
import { TxHistoryItem } from '@core/types';
import { isBitcoinNetwork, isNftTokenType, isSolanaNetwork } from '@core/common';
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
      historyItem.txType === TransactionType.SWAP ||
      historyItem.txType === TransactionType.NFT_BUY ||
      historyItem.txType === TransactionType.NFT_RECEIVE ||
      historyItem.txType === TransactionType.NFT_SEND ||
      (historyItem.txType === TransactionType.SEND &&
        historyItem.tokens[0]?.type === 'ERC1155') ||
      ((historyItem.txType === TransactionType.TRANSFER ||
        historyItem.txType === TransactionType.UNKNOWN) &&
        historyItem.tokens[0] &&
        isNftTokenType(historyItem.tokens[0].type))
    ) {
      return true;
    }
    return false;
  }, [historyItem]);

  const gasDisplayAmount = useMemo(() => {
    if (network && isBitcoinNetwork(network)) {
      return satoshiToBtc(Number(historyItem.gasUsed)).toFixed(6).toString();
    }
    if (network && isSolanaNetwork(network)) {
      const unit = new TokenUnit(
        Number(historyItem.gasUsed) * Number(historyItem.gasPrice ?? 1),
        9,
        '',
      );

      return unit.toDisplay();
    }
    return weiToAvax(
      new Big(
        Number(historyItem.gasUsed) *
          Number(historyItem.gasPrice === undefined ? 1 : historyItem.gasPrice),
      ),
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
      if (historyItem.bridgeAnalysis.isBridgeTx) {
        return t('Bridge');
      }
      if (
        historyItem.txType === TransactionType.SEND &&
        historyItem.tokens[0]?.type === 'ERC1155'
      ) {
        return t('NFT Sent');
      }
      switch (historyItem.txType) {
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
        case TransactionType.NFT_SEND:
          return t('NFT Sent');
        case TransactionType.TRANSFER:
        case TransactionType.UNKNOWN:
        case TransactionType.NFT_RECEIVE:
          if (
            historyItem.tokens[0] &&
            isNftTokenType(historyItem.tokens[0]?.type)
          ) {
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
          : historyItem.txType + '-activity-card'
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
                  type: historyItem.txType,
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
                  type: historyItem.txType,
                });
                window.open(historyItem.explorerLink, '_blank', 'noreferrer');
              }}
              data-testid="explorer-link"
            >
              <TruncateFeeAmount amount={gasDisplayAmount} />

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
