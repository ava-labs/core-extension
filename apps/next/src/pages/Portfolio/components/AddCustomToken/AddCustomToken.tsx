import { Page } from '@/components/Page';
import { Select } from '@/components/Select';
import { WarningMessage } from '@/components/WarningMessage';
import {
  Box,
  Button,
  Collapse,
  Fade,
  MenuItem,
  Stack,
  StackProps,
  TextField,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useAddCustomToken } from './hooks/useAddCustomToken';
import { useTokenLookup } from './hooks/useTokenLookup';
import * as Styled from './Styled';

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

export const AddCustomToken: FC = () => {
  const { t } = useTranslation();
  const { networks, isDeveloperMode } = useNetworkContext();
  const { goBack } = useHistory();
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [chainId, setChainId] = useState<NetworkWithCaipId['caipId']>(
    isDeveloperMode ? 'eip155:43113' : 'eip155:43114',
  ); // AVAX C-Chain
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const evmOnly = networks.filter(
    (network) => network.vmName === NetworkVMType.EVM,
  );

  const { addCustomToken } = useAddCustomToken();
  const isTokenExists = useTokenLookup();

  return (
    <Page title={t('Add Custom Token')} contentProps={contentProps}>
      <Select
        size="small"
        label={t('Network')}
        value={chainId ?? ''}
        onChange={(e) =>
          setChainId(e.target.value as NetworkWithCaipId['caipId'])
        }
      >
        {evmOnly.map((network) => (
          <MenuItem key={network.caipId} value={network.caipId}>
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              justifySelf="end"
            >
              <Styled.Avatar src={network.logoUri} />
              <Typography variant="body3">{network.chainName}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Select>

      <Collapse in={Boolean(chainId)}>
        <TextField
          fullWidth
          size="small"
          label={t('Token contract address')}
          value={tokenAddress}
          onChange={(e) => {
            const newAddress = e.target.value;
            if (newAddress.length && isTokenExists(newAddress)) {
              setError(t('Token already exists in the wallet.'));
            } else {
              setError('');
            }
            setTokenAddress(newAddress);
          }}
          placeholder={t('Type in or paste token contract address')}
          multiline
          minRows={6}
          slots={{
            input: Styled.TokenAddressInput,
          }}
        />
      </Collapse>

      <Fade in={error.length > 0}>
        <WarningMessage>{error}</WarningMessage>
      </Fade>

      <Box mt="auto">
        <Button
          size="extension"
          fullWidth
          variant="contained"
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            try {
              await addCustomToken(tokenAddress, chainId!);
              toast.success(t('Token Added'), {
                duration: 2000,
                id: 'custom-token-added',
              });
              goBack();
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading || !!error?.length || !tokenAddress}
        >
          {t('Add Token')}
        </Button>
      </Box>
    </Page>
  );
};
