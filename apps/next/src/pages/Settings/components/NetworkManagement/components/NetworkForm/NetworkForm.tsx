import {
  ChevronRightIcon,
  Divider,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import {
  ChainIdField,
  ExplorerUrlField,
  LogoUrlField,
  RpcUrlField,
  TokenNameField,
  TokenSymbolField,
} from './NetworkFormField';
import { Network } from '@core/types';
import { NetworkDetailsCard } from '../NetworkDetailsCard';
import { NetworkFormTab } from './types';

type NetworkFormProps = {
  network: Network;
  setNetwork: (network: Network) => void;
  setTab: (tab: NetworkFormTab) => void;
};

export const NetworkForm = ({
  network,
  setNetwork,
  setTab,
}: NetworkFormProps) => {
  const { t } = useTranslation();

  const convertChainIdToString = (chainId: number) => {
    return chainId === 0 ? '' : chainId.toString();
  };

  return (
    <NetworkDetailsCard>
      <RpcUrlField
        value={network.rpcUrl}
        onChange={(rpcUrl) => setNetwork({ ...network, rpcUrl })}
      />
      <Divider />
      <ChainIdField
        value={convertChainIdToString(network.chainId)}
        onChange={(chainId) =>
          setNetwork({ ...network, chainId: Number(chainId) })
        }
      />
      <Divider />
      <TokenSymbolField
        value={network.networkToken.symbol}
        onChange={(tokenSymbol) =>
          setNetwork({
            ...network,
            networkToken: { ...network.networkToken, symbol: tokenSymbol },
          })
        }
      />
      <Divider />
      <TokenNameField
        value={network.networkToken.name}
        onChange={(tokenName) =>
          setNetwork({
            ...network,
            networkToken: { ...network.networkToken, name: tokenName },
          })
        }
      />
      <Divider />
      <ExplorerUrlField
        value={network.explorerUrl}
        onChange={(explorerUrl) => setNetwork({ ...network, explorerUrl })}
      />
      <Divider />
      <LogoUrlField
        value={network.logoUri}
        onChange={(logoUri) => setNetwork({ ...network, logoUri })}
      />
      <Divider />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        onClick={() => setTab('rpc-headers')}
        py={1.5}
      >
        <Typography>{t('Custom RPC Headers')}</Typography>
        <ChevronRightIcon size={16} />
      </Stack>
    </NetworkDetailsCard>
  );
};
