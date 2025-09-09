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
import { FieldInfo, NetworkFormFields, EditNetworkFormView } from './types';
import { Card } from '@/components/Card';

type NetworkFormProps = {
  network: Network;
  setNetwork: (network: Network) => void;
  setView: (view: EditNetworkFormView) => void;
  canResetRpcUrl: boolean;
  fieldInfo: { [key in NetworkFormFields]?: FieldInfo };
  readOnly: boolean;
  pageType: 'add' | 'edit';
};

export const NetworkForm = ({
  network,
  setNetwork,
  setView,
  canResetRpcUrl,
  fieldInfo,
  readOnly,
  pageType,
}: NetworkFormProps) => {
  const { t } = useTranslation();

  const convertChainIdToString = (chainId: number) => {
    return chainId === 0 ? '' : chainId.toString();
  };

  return (
    <Card sx={{ width: '100%', px: 2 }}>
      <RpcUrlField
        value={network.rpcUrl}
        onChange={(rpcUrl) => setNetwork({ ...network, rpcUrl })}
        error={fieldInfo.rpcUrl?.error}
        required={fieldInfo.rpcUrl?.required}
        canResetRpcUrl={canResetRpcUrl}
        resetAction={fieldInfo.rpcUrl?.resetAction ?? (() => {})}
        readOnly={readOnly}
      />
      <Divider />
      <ChainIdField
        value={convertChainIdToString(network.chainId)}
        onChange={(chainId) =>
          setNetwork({ ...network, chainId: Number(chainId) })
        }
        error={fieldInfo.chainId?.error}
        required={fieldInfo.chainId?.required}
        readOnly={pageType === 'add' ? false : true}
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
        error={fieldInfo.tokenSymbol?.error}
        required={fieldInfo.tokenSymbol?.required}
        readOnly={readOnly}
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
        error={fieldInfo.tokenName?.error}
        required={fieldInfo.tokenName?.required}
        readOnly={readOnly}
      />
      <Divider />
      <ExplorerUrlField
        value={network.explorerUrl}
        onChange={(explorerUrl) => setNetwork({ ...network, explorerUrl })}
        error={fieldInfo.explorerUrl?.error}
        required={fieldInfo.explorerUrl?.required}
        readOnly={readOnly}
      />
      <Divider />
      <LogoUrlField
        value={network.logoUri}
        onChange={(logoUri) => setNetwork({ ...network, logoUri })}
        error={fieldInfo.logoUrl?.error}
        required={fieldInfo.logoUrl?.required}
        readOnly={readOnly}
      />
      <Divider />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        onClick={() => setView('rpc-headers')}
        p={1.5}
      >
        <Typography>{t('Custom RPC Headers')}</Typography>
        <ChevronRightIcon size={16} />
      </Stack>
    </Card>
  );
};
