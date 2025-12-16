import { Page } from '@/components/Page';
import { WarningMessage } from '@/components/WarningMessage';
import {
  Box,
  Button,
  Collapse,
  Fade,
  MenuItem,
  Stack,
  StackProps,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { SearchableSelect } from '@/components/SearchableSelect';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { ExtensionRequest, NetworkWithCaipId } from '@core/types';
import { useConnectionContext, useNetworkContext } from '@core/ui';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useAddCustomToken } from './hooks/useAddCustomToken';
import { useTokenLookup } from './hooks/useTokenLookup';
import * as Styled from './Styled';
import { FaCheck } from 'react-icons/fa';
import { GetTokenDataHandler } from '~/services/settings/handlers/getTokenDataByAddress';

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
  const [networkQuery, setNetworkQuery] = useState<string>('');
  const { request } = useConnectionContext();

  const evmOnly = networks.filter(
    (network) => network.vmName === NetworkVMType.EVM,
  );

  const { addCustomToken } = useAddCustomToken();
  const isTokenExists = useTokenLookup();

  const selectedNetwork = evmOnly.find((n) => n.caipId === chainId);

  const validateTokenData = useCallback(
    async (address: string, networkCaipId?: NetworkWithCaipId['caipId']) => {
      if (!address.length) {
        setError('');
        return;
      }

      if (isTokenExists(address)) {
        setError(t('Token already exists in the wallet.'));
        return;
      }

      setIsLoading(true);
      try {
        const data = await request<GetTokenDataHandler>({
          method: ExtensionRequest.SETTINGS_GET_TOKEN_DATA,
          params: [address, networkCaipId],
        });

        if (!data) {
          setError(t('Not a valid ERC-20 token address.'));
        } else {
          setError('');
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : t('Not a valid ERC-20 token address.'),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isTokenExists, request, t],
  );

  const handleTokenAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newAddress = e.target.value;
    setTokenAddress(newAddress);
    validateTokenData(newAddress, selectedNetwork?.caipId);
  };

  const handleNetworkChange = (network: NetworkWithCaipId) => {
    setChainId(network.caipId);
  };

  // Re-validate token when network changes
  useEffect(() => {
    if (tokenAddress && chainId) {
      validateTokenData(tokenAddress, chainId);
    }
  }, [chainId, tokenAddress, validateTokenData]);

  return (
    <Page title={t('Add Custom Token')} contentProps={contentProps}>
      <SearchableSelect<NetworkWithCaipId>
        id="add-custom-token-network-select"
        label={t('Network')}
        options={evmOnly}
        getOptionId={(network) => network.caipId}
        isOptionEqualToValue={(option, value) => option.caipId === value.caipId}
        getGroupLabel={() => ''}
        value={selectedNetwork}
        query={networkQuery}
        skipGroupingEntirely
        onValueChange={handleNetworkChange}
        onQueryChange={setNetworkQuery}
        searchFn={(network, query) =>
          query
            ? network.chainName.toLowerCase().includes(query.toLowerCase())
            : true
        }
        renderValue={(network) =>
          network ? (
            <Stack direction="row" alignItems="center" gap={1}>
              <Styled.Avatar src={network.logoUri} />
              <Typography variant="body3">{network.chainName}</Typography>
            </Stack>
          ) : (
            <Typography variant="body3" color="text.secondary">
              {t('Select network')}
            </Typography>
          )
        }
        renderOption={(network, getOptionProps) => (
          <MenuItem
            key={network.caipId}
            {...getOptionProps(network)}
            sx={{ px: 2 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Styled.Avatar src={network.logoUri} />
                <Typography variant="body3">{network.chainName}</Typography>
              </Stack>
              <Stack position="relative" height={12}>
                <Fade
                  in={network.caipId === chainId}
                  mountOnEnter
                  unmountOnExit
                >
                  <FaCheck
                    className="check"
                    style={{ position: 'absolute', right: 0 }}
                  />
                </Fade>
              </Stack>
            </Stack>
          </MenuItem>
        )}
      />

      <Collapse in={Boolean(chainId)}>
        <Styled.TextField
          fullWidth
          size="small"
          label={t('Token contract address')}
          value={tokenAddress}
          onChange={handleTokenAddressChange}
          placeholder={t('Type in or paste token contract address')}
          multiline
          minRows={6}
          slots={{
            input: Styled.TokenAddressInput,
          }}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '11px',
              color: 'text.secondary',
              transform: 'translate(14px, 10px) scale(1)',
              '&.Mui-focused': {
                color: 'text.secondary',
              },
            },
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
