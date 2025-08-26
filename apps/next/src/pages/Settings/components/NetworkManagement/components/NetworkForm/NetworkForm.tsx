import {
  Card,
  ChevronRightIcon,
  Divider,
  Stack,
  styled,
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
import { useState } from 'react';
import { Network } from '@core/types';
import { NetworkNameField } from './NetworkNameField';
import { NetworkAvatar } from '../BadgedAvatar/NetworkAvatar';

type NetworkFormProps = {
  network: Network;
  setNetwork: (network: Network) => void;
  setTab: (tab: 'add' | 'rpc-headers') => void;
};

export const NetworkForm = ({
  network,
  setNetwork,
  setTab,
}: NetworkFormProps) => {
  const { t } = useTranslation();
  const [isNaming, setIsNaming] = useState(false);

  const convertChainIdToString = (chainId: number) => {
    return chainId === 0 ? '' : chainId.toString();
  };

  return (
    <Stack width="100%" alignItems="center" sx={{ flex: 1 }}>
      <NetworkAvatar
        network={network}
        sx={{ width: '80px', height: '80px', mb: 2.75 }}
      />
      <NetworkNameField
        name={network.chainName}
        setName={(name) => setNetwork({ ...network, chainName: name })}
        isNaming={isNaming}
        setIsNaming={setIsNaming}
        autoFocus
      />
      <NetworkDetailsCard sx={{ mt: 6 }}>
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
    </Stack>
  );
};

const NetworkDetailsCard = styled(Card)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.mediumBorderRadius,
  paddingInline: theme.spacing(2),
}));
