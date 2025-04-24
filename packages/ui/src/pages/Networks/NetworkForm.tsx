import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  styled,
} from '@avalabs/core-k2-components';

import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { TextFieldLabel } from 'packages/ui/src/components/common/TextFieldLabel';
import {
  CustomRpcHeaders,
  Network,
} from '@core/service-worker';
import { NetworkRpcHeadersManager } from './NetworkRpcHeadersManager';

export interface NetworkFormActions {
  resetFormErrors: () => void;
}

export enum NetworkFormAction {
  Add = 'add',
  Edit = 'edit',
}
interface NetworkFormProps {
  customNetwork: Network;
  handleChange?: (network: Network, formValid: boolean) => void;
  readOnly?: boolean;
  showErrors?: boolean;
  action?: NetworkFormAction;
  isCustomNetwork?: boolean;
  handleRpcHeadersChange?: (headers: CustomRpcHeaders) => void;
  handleResetUrl?: () => void;
}

const InputContainer = styled(Stack)`
  position: relative;
  overflow: hidden;
  width: 100%;
  gap: 4px;
  min-height: 92px;
`;

const isValidURL = (text: string) => {
  let url;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }
  if (
    url.protocol === 'https:' ||
    url.protocol === 'ipfs:' ||
    url.protocol === 'http:'
  ) {
    return true;
  }
};

export const NetworkForm = forwardRef<NetworkFormActions, NetworkFormProps>(
  (
    {
      customNetwork,
      handleChange,
      handleRpcHeadersChange,
      readOnly = false,
      showErrors = false,
      action,
      isCustomNetwork = false,
      handleResetUrl,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { isChainIdExist } = useNetworkContext();
    const [rpcError, setRpcError] = useState<string>();
    const [chainNameError, setChainNameError] = useState<string>();
    const [chainIdError, setChainIdError] = useState<string>();
    const [tokenSymbolError, setTokenSymbolError] = useState<string>();
    const [explorerUrlError, setExplorerUrlError] = useState<string>();
    const [tokenNameError, setTokenNameError] = useState<string>();

    useImperativeHandle(ref, () => {
      return {
        resetFormErrors: resetErrors,
      };
    }, []);

    const FormErrors = {
      RPC_ERROR: t('RPC required'),
      CHAIN_NAME_ERROR: t('Network Name is required'),
      CHAIN_ID_ERROR: t('Chain ID is required'),
      TOKEN_SYMBOL_ERROR: t('Network Token Symbol is required'),
      CHAIN_ID_EXISTS: t('This Chain ID has been added already'),
      INVALID_URL: t('This URL is invalid'),
      TOKEN_NAME_ERROR: t('Network Token Name is required'),
    };

    const validateForm = useCallback(
      (updatedNetwork: Network) => {
        let valid = true;

        if (!updatedNetwork.rpcUrl) {
          setRpcError(FormErrors.RPC_ERROR);
          valid = false;
        }
        if (updatedNetwork.rpcUrl && !isValidURL(updatedNetwork.rpcUrl)) {
          setRpcError(FormErrors.INVALID_URL);
          valid = false;
        }

        if (!updatedNetwork.chainName) {
          setChainNameError(FormErrors.CHAIN_NAME_ERROR);
          valid = false;
        }

        if (!updatedNetwork.chainId || updatedNetwork.chainId === 0) {
          setChainIdError(FormErrors.CHAIN_ID_ERROR);
          valid = false;
        }

        if (
          action === NetworkFormAction.Add &&
          isChainIdExist(updatedNetwork.chainId)
        ) {
          setChainIdError(FormErrors.CHAIN_ID_EXISTS);
          valid = false;
        }

        if (!updatedNetwork.networkToken.symbol) {
          setTokenSymbolError(FormErrors.TOKEN_SYMBOL_ERROR);
          valid = false;
        }
        if (!updatedNetwork.networkToken.name) {
          setTokenNameError(FormErrors.TOKEN_NAME_ERROR);
          valid = false;
        }

        return valid;
      },
      [
        FormErrors.CHAIN_ID_ERROR,
        FormErrors.CHAIN_ID_EXISTS,
        FormErrors.CHAIN_NAME_ERROR,
        FormErrors.INVALID_URL,
        FormErrors.RPC_ERROR,
        FormErrors.TOKEN_NAME_ERROR,
        FormErrors.TOKEN_SYMBOL_ERROR,
        action,
        isChainIdExist,
      ],
    );

    useEffect(() => {
      if (showErrors) {
        validateForm(customNetwork);
      }
    }, [showErrors, customNetwork, validateForm]);

    const resetErrors = () => {
      setRpcError('');
      setChainNameError('');
      setChainIdError('');
      setTokenSymbolError('');
      setExplorerUrlError('');
      setTokenNameError('');
    };

    const handleUpdate = (updatedNetwork: Network) => {
      resetErrors();
      handleChange?.(updatedNetwork, validateForm(updatedNetwork));
    };

    const canResetRpcUrl = handleResetUrl && !isCustomNetwork;

    return (
      <Stack sx={{ width: 1 }}>
        <InputContainer>
          <TextFieldLabel label={t('Network RPC URL')} />
          <TextField
            size="small"
            onChange={(e) => {
              e.stopPropagation();
              handleUpdate({
                ...customNetwork,
                rpcUrl: e.target.value,
              });
            }}
            data-testid="network-rpc-url"
            value={customNetwork.rpcUrl}
            placeholder="http(s)://URL"
            InputProps={{
              readOnly,
              fullWidth: true,
              endAdornment: canResetRpcUrl ? (
                <InputAdornment position="end">
                  <Button variant="text" size="small" onClick={handleResetUrl}>
                    {t('Reset')}
                  </Button>
                </InputAdornment>
              ) : null,
            }}
            error={!!rpcError}
            helperText={rpcError}
          />
        </InputContainer>
        <InputContainer>
          <TextFieldLabel label={t('Network Name')} />
          <TextField
            size="small"
            onChange={(e) => {
              e.stopPropagation();
              handleUpdate({
                ...customNetwork,
                chainName: e.target.value,
              });
            }}
            data-testid="network-name"
            value={customNetwork.chainName}
            placeholder={t('Enter Name')}
            fullWidth
            InputProps={{
              readOnly:
                readOnly ||
                (!isCustomNetwork && action === NetworkFormAction.Edit),
            }}
            error={!!chainNameError}
            helperText={chainNameError}
          />
        </InputContainer>
        <InputContainer>
          <TextFieldLabel label={t('Chain ID')} />
          <TextField
            size="small"
            onChange={(e) => {
              e.stopPropagation();
              handleUpdate({
                ...customNetwork,
                chainId: parseInt(e.target.value),
              });
            }}
            disabled={action === NetworkFormAction.Edit}
            data-testid="chain-id"
            value={isNaN(customNetwork.chainId) ? '' : customNetwork.chainId}
            placeholder={t('Enter Chain ID')}
            fullWidth
            InputProps={{
              readOnly:
                readOnly ||
                (!isCustomNetwork && action === NetworkFormAction.Edit),
            }}
            type="number"
            error={!!chainIdError}
            helperText={chainIdError}
          />
        </InputContainer>
        <InputContainer>
          <TextFieldLabel label={t('Network Token Symbol')} />
          <TextField
            size="small"
            onChange={(e) => {
              e.stopPropagation();
              handleUpdate({
                ...customNetwork,
                networkToken: {
                  ...customNetwork.networkToken,
                  symbol: e.target.value,
                },
              });
            }}
            data-testid="network-token-symbol"
            value={customNetwork.networkToken.symbol}
            placeholder={t('Enter Token Symbol')}
            fullWidth
            InputProps={{
              readOnly:
                readOnly ||
                (!isCustomNetwork && action === NetworkFormAction.Edit),
            }}
            error={!!tokenSymbolError}
            helperText={tokenSymbolError}
          />
        </InputContainer>
        <InputContainer>
          <TextFieldLabel label={t('Network Token Name')} />
          <TextField
            size="small"
            onChange={(e) => {
              e.stopPropagation();
              handleUpdate({
                ...customNetwork,
                networkToken: {
                  ...customNetwork.networkToken,
                  name: e.target.value,
                },
              });
            }}
            data-testid="network-token-name"
            value={customNetwork.networkToken.name}
            placeholder={t('Enter Token')}
            fullWidth
            InputProps={{
              readOnly:
                readOnly ||
                (!isCustomNetwork && action === NetworkFormAction.Edit),
            }}
            error={!!tokenNameError}
            helperText={tokenNameError}
          />
        </InputContainer>
        <InputContainer>
          <TextFieldLabel label={t('Explorer URL (Optional)')} />
          <TextField
            size="small"
            onChange={(e) => {
              e.stopPropagation();
              handleUpdate({
                ...customNetwork,
                explorerUrl: e.target.value,
              });
            }}
            data-testid="explorer-url"
            value={customNetwork.explorerUrl}
            placeholder={t('Enter URL')}
            fullWidth
            InputProps={{
              readOnly:
                readOnly ||
                (!isCustomNetwork && action === NetworkFormAction.Edit),
            }}
            error={!!explorerUrlError}
            helperText={explorerUrlError}
          />
        </InputContainer>
        <InputContainer>
          <TextFieldLabel label={t('Logo URL (Optional)')} />
          <TextField
            size="small"
            onChange={(e) => {
              e.stopPropagation();
              handleUpdate({
                ...customNetwork,
                logoUri: e.target.value,
              });
            }}
            data-testid="logo-url"
            value={customNetwork.logoUri}
            placeholder={t('Enter URL')}
            fullWidth
            InputProps={{
              readOnly:
                readOnly ||
                (!isCustomNetwork && action === NetworkFormAction.Edit),
            }}
          />
        </InputContainer>
        <InputContainer>
          <TextFieldLabel label={t('Custom RPC Headers')} />
          <NetworkRpcHeadersManager
            isReadOnly={readOnly}
            network={customNetwork}
            onChange={handleRpcHeadersChange}
          />
        </InputContainer>
      </Stack>
    );
  },
);

NetworkForm.displayName = 'NetworkForm';
