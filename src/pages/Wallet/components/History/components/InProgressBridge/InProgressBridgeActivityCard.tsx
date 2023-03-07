import { BridgeTransaction, useBridgeSDK } from '@avalabs/bridge-sdk';
import {
  Button,
  Card,
  Divider,
  ExternalLinkIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { blockchainToNetwork } from '@src/pages/Bridge/utils/blockchainConversion';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useBlockchainNames } from '../../useBlockchainNames';
import { InProgressBridgeIcon } from './InProgressBridgeIcon';

export interface InProgressBridgeActivityCardProp {
  tx: BridgeTransaction;
}

export function InProgressBridgeActivityCard({
  tx,
}: InProgressBridgeActivityCardProp) {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const { networks } = useNetworkContext();
  const { bridgeConfig } = useBridgeSDK();

  const { sourceBlockchain, targetBlockchain } = useBlockchainNames(tx);

  const { bridgeTransactions } = useBridgeContext();
  const bridgeTransaction = bridgeTransactions[tx.sourceTxHash] as
    | BridgeTransaction
    | undefined;

  const explorerUrl = useMemo(() => {
    const networkData = blockchainToNetwork(
      tx.sourceChain,
      networks,
      bridgeConfig
    );
    if (networkData) {
      return getExplorerAddressByNetwork(networkData, tx.sourceTxHash);
    }
    return undefined;
  }, [tx.sourceChain, tx.sourceTxHash, networks, bridgeConfig]);

  const inProgressValue = useMemo(() => {
    if (!bridgeTransaction) {
      return 0;
    }
    const confirmationCount = bridgeTransaction.requiredConfirmationCount + 1; // 1 is added for target network
    const currentCount =
      bridgeTransaction.confirmationCount >
      bridgeTransaction.requiredConfirmationCount
        ? bridgeTransaction.requiredConfirmationCount
        : bridgeTransaction.confirmationCount;

    return (currentCount / confirmationCount) * 100;
  }, [bridgeTransaction]);

  return (
    <Card
      sx={{
        p: 2,
      }}
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
            cursor: 'pointer',
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
              <InProgressBridgeIcon value={inProgressValue} />
              <Stack>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: theme.spacing(32),
                  }}
                >
                  <Typography variant="h6">{t('Bridge')}</Typography>
                  <Stack sx={{ flexDirection: 'row', columnGap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'fontWeightSemibold' }}
                    >
                      {tx.amount?.toString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={(theme) => ({ color: theme.palette.primary.dark })}
                    >
                      {tx.symbol}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={(theme) => ({ color: theme.palette.primary.dark })}
                  >
                    {sourceBlockchain} -&gt; {targetBlockchain}
                  </Typography>

                  <Button
                    variant="text"
                    disableRipple
                    sx={{
                      p: 0,
                    }}
                    onClick={() => {
                      history.push(
                        `/bridge/transaction-status/${tx.sourceChain}/${tx.sourceTxHash}/${tx.sourceStartedAt}`
                      );
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 'fontWeightSemibold' }}
                    >
                      {t('View Status')}
                    </Typography>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography>{t('Network Fee')}</Typography>
          <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>
            <Typography>{t('Pending')}</Typography>
            {explorerUrl && (
              <ExternalLinkIcon
                size={16}
                sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
                onClick={() => {
                  window.open(explorerUrl, '_blank');
                }}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
