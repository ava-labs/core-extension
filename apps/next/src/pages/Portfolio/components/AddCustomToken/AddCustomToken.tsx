import { Page } from '@/components/Page';
import { Select } from '@/components/Select';
import {
  Box,
  Button,
  Collapse,
  MenuItem,
  StackProps,
  TextField,
} from '@avalabs/k2-alpine';
import { NetworkContractToken, NetworkVMType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddCustomToken } from './hooks/useAddCustomToken';

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

export const AddCustomToken: FC = () => {
  const { t } = useTranslation();
  const { networks } = useNetworkContext();
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [chainId, setChainId] = useState<NetworkWithCaipId['caipId']>();
  const [isLoading, _setIsLoading] = useState<boolean>(false);
  const [newTokenData, _setNewTokenData] = useState<NetworkContractToken>();
  const [error, _setError] = useState<string>('');

  const evmOnly = networks.filter(
    (network) => network.vmName === NetworkVMType.EVM,
  );

  const { addCustomToken } = useAddCustomToken();

  return (
    <Page title={t('Add Custom Token')} contentProps={contentProps}>
      <Select
        size="small"
        label={t('Network')}
        value={chainId}
        onChange={(e) =>
          setChainId(e.target.value as NetworkWithCaipId['caipId'])
        }
      >
        {evmOnly.map((network) => (
          <MenuItem key={network.caipId} value={network.caipId}>
            {network.chainName}
          </MenuItem>
        ))}
      </Select>

      <Collapse in={Boolean(chainId)}>
        <TextField
          fullWidth
          size="small"
          label={t('Token Address')}
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder={t('Type in or paste token address')}
          multiline
        />
      </Collapse>

      <Box mt="auto">
        <Button
          size="extension"
          fullWidth
          variant="contained"
          loading={isLoading}
          onClick={() => addCustomToken(tokenAddress, chainId!)}
          disabled={isLoading || !!error?.length || !newTokenData}
        >
          {t('Add Token')}
        </Button>
      </Box>
    </Page>
  );
};
