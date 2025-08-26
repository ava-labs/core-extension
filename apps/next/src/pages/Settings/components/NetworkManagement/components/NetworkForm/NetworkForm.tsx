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
  NameField,
  RpcUrlField,
  TokenNameField,
  TokenSymbolField,
} from './NetworkFormField';
import { Network } from '@avalabs/core-chains-sdk';
import { ContactNameField } from '@/pages/Contacts/components/ContactNameField';
import { useState } from 'react';

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
    <Stack width="100%" sx={{ flex: 1 }}>
      <ContactNameField
        name={network.chainName}
        setName={(name) => setNetwork({ ...network, chainName: name })}
        isNaming={isNaming}
        setIsNaming={setIsNaming}
        autoFocus
      />
      <NetworkDetailsCard>
        <RpcUrlField
          value={network.rpcUrl}
          onChange={(rpcUrl) => setNetwork({ ...network, rpcUrl })}
        />
        <Divider />
        <NameField
          value={network.chainName}
          onChange={(chainName) => setNetwork({ ...network, chainName })}
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
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          onClick={() => setTab('rpc-headers')}
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
