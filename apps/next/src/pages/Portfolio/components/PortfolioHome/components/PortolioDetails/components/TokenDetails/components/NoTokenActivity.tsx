import { Button, Typography } from '@avalabs/k2-alpine';

import { Stack } from '@avalabs/k2-alpine';
import {
  getAddressForChain,
  getExplorerAddressByNetwork,
  openNewTab,
} from '@core/common';
import { useNetworkContext } from '@core/ui/src/contexts/NetworkProvider';
import { useTranslation } from 'react-i18next';
import { AssetsErrorState } from '../../AssetsErrorState';
import { useAccountsContext } from '@core/ui/src/contexts/AccountsProvider';

export const NoTokenActivity = ({ networkId }: { networkId: number }) => {
  const { t } = useTranslation();
  const { getNetwork } = useNetworkContext();
  const { accounts } = useAccountsContext();

  const activeAccount = accounts.active;
  const network = getNetwork(networkId);
  const address = getAddressForChain(network, activeAccount);

  const explorerUrl = network
    ? getExplorerAddressByNetwork(network, address, 'address')
    : undefined;

  if (!explorerUrl) {
    return <AssetsErrorState />;
  }

  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      gap={1}
      px={5}
      textAlign="center"
    >
      <Typography variant="subtitle3">{t('No recent transctions')}</Typography>
      <Typography variant="caption" color="text.secondary">
        {t('Check full transaction history on the explorer')}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => openNewTab({ url: explorerUrl })}
        sx={{
          mt: 2,
        }}
      >
        {t('View on explorer')}
      </Button>
    </Stack>
  );
};
// ]

// https://subnets.avax.network/c-chain/token/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E
