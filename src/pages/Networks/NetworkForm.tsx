import { Network } from '@avalabs/chains-sdk';
import {
  VerticalFlex,
  Input,
  HorizontalFlex,
  PencilIcon,
} from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { t } from 'i18next';

export enum NetworkFormAction {
  Add = 'add',
  Edit = 'edit',
}
interface NetworkFormProps {
  customNetwork: Network;
  handleChange: (network: Network, formValid: boolean) => void;
  readOnly?: boolean;
  showErrors?: boolean;
  action?: NetworkFormAction;
}

const StyledInput = styled(Input)`
  input {
    background: ${({ theme, readOnly }) =>
      readOnly ? theme.colors.bg3 : `${theme.colors.bg3}80`};
  }
`;
const InputContainer = styled(HorizontalFlex)`
  align-items: center;
  position: relative;
  overflow: hidden;
  width: 100%;
`;

const IconContainer = styled.div<{ isEdit: boolean }>`
  margin-left: 8px;
  &.item-appear {
    margin-right: -100px;
  }
  &.item-appear-active {
    margin-right: 0px;
    transition: margin-right 500ms ease-in-out;
  }
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

export const NetworkForm = ({
  customNetwork,
  handleChange,
  readOnly = false,
  showErrors = false,
  action,
}: NetworkFormProps) => {
  const { isChainIdExist } = useNetworkContext();
  const [rpcError, setRpcError] = useState<string>();
  const [chainNameError, setChainNameError] = useState<string>();
  const [chainIdError, setChainIdError] = useState<string>();
  const [tokenSymbolError, setTokenSymbolError] = useState<string>();
  const [explorerUrlError, setExplorerUrlError] = useState<string>();
  const theme = useTheme();

  const FormErrors = {
    RPC_ERROR: t('RPC required'),
    CHAIN_NAME_ERROR: t('Network Name is required'),
    CHAIN_ID_ERROR: t('Chain ID is required'),
    TOKEN_SYMBOL_ERROR: t('Network Token Symbol is required'),
    EXPLORER_URL_ERROR: t('Explorer URL is requried'),
    CHAIN_ID_EXISTS: t('This Chan ID has been added already'),
    INVALID_URL: t('This URL is invalid'),
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

      if (action === 'add' && isChainIdExist(updatedNetwork.chainId)) {
        setChainIdError(FormErrors.CHAIN_ID_EXISTS);
        valid = false;
      }

      if (!updatedNetwork.networkToken.symbol) {
        setTokenSymbolError(FormErrors.TOKEN_SYMBOL_ERROR);
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
      FormErrors.TOKEN_SYMBOL_ERROR,
      action,
      isChainIdExist,
    ]
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
  };

  const handleUpdate = (updatedNetwork: Network) => {
    resetErrors();
    handleChange(updatedNetwork, validateForm(updatedNetwork));
  };

  return (
    <VerticalFlex width="100%">
      <InputContainer>
        <StyledInput
          onChange={(e) => {
            e.stopPropagation();
            handleUpdate({
              ...customNetwork,
              rpcUrl: e.target.value,
            });
          }}
          value={customNetwork.rpcUrl}
          label={t('Network RPC URL')}
          placeholder="http(s)://URL"
          margin="0 0 16px 0"
          width="100%"
          readOnly={readOnly}
          error={!!rpcError}
          errorMessage={rpcError}
        />
        {!readOnly && action === 'edit' && (
          <CSSTransition timeout={500} classNames="item" appear in exit>
            <IconContainer isEdit={!readOnly}>
              <PencilIcon color={theme.colors.text1} width={14} />
            </IconContainer>
          </CSSTransition>
        )}
      </InputContainer>
      <InputContainer>
        <StyledInput
          onChange={(e) => {
            e.stopPropagation();
            handleUpdate({
              ...customNetwork,
              chainName: e.target.value,
            });
          }}
          value={customNetwork.chainName}
          label={t('Network Name')}
          placeholder={t('Enter Name')}
          margin="0 0 16px 0"
          width="100%"
          readOnly={readOnly}
          error={!!chainNameError}
          errorMessage={chainNameError}
        />
        {!readOnly && action === 'edit' && (
          <CSSTransition timeout={500} classNames="item" appear in exit>
            <IconContainer isEdit={!readOnly}>
              <PencilIcon color={theme.colors.text1} width={14} />
            </IconContainer>
          </CSSTransition>
        )}
      </InputContainer>
      <InputContainer>
        <StyledInput
          onChange={(e) => {
            e.stopPropagation();
            handleUpdate({
              ...customNetwork,
              chainId: parseInt(e.target.value),
            });
          }}
          value={isNaN(customNetwork.chainId) ? '' : customNetwork.chainId}
          label={t('Chain ID')}
          placeholder={t('Enter Chain ID')}
          margin="0 0 16px 0"
          width="100%"
          readOnly={readOnly}
          type="number"
          error={!!chainIdError}
          errorMessage={chainIdError}
        />
        {!readOnly && action === 'edit' && (
          <CSSTransition timeout={500} classNames="item" appear in exit>
            <IconContainer isEdit={!readOnly}>
              <PencilIcon color={theme.colors.text1} width={14} />
            </IconContainer>
          </CSSTransition>
        )}
      </InputContainer>
      <InputContainer>
        <StyledInput
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
          value={customNetwork.networkToken.symbol}
          label={t('Network Token Symbol')}
          placeholder={t('Enter Token Symbol')}
          margin="0 0 16px 0"
          width="100%"
          readOnly={readOnly}
          error={!!tokenSymbolError}
          errorMessage={tokenSymbolError}
        />
        {!readOnly && action === 'edit' && (
          <CSSTransition timeout={500} classNames="item" appear in exit>
            <IconContainer isEdit={!readOnly}>
              <PencilIcon color={theme.colors.text1} width={14} />
            </IconContainer>
          </CSSTransition>
        )}
      </InputContainer>
      <InputContainer>
        <StyledInput
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
          value={customNetwork.networkToken.name}
          label={t('Network Token Name (Optional)')}
          placeholder={t('Enter Token')}
          margin="0 0 16px 0"
          width="100%"
          readOnly={readOnly}
        />
        {!readOnly && action === 'edit' && (
          <CSSTransition timeout={500} classNames="item" appear in exit>
            <IconContainer isEdit={!readOnly}>
              <PencilIcon color={theme.colors.text1} width={14} />
            </IconContainer>
          </CSSTransition>
        )}
      </InputContainer>
      <InputContainer>
        <StyledInput
          onChange={(e) => {
            e.stopPropagation();
            handleUpdate({
              ...customNetwork,
              explorerUrl: e.target.value,
            });
          }}
          value={customNetwork.explorerUrl}
          label={t('Explorer URL (Optional)')}
          placeholder={t('Enter URL')}
          margin="0 0 16px 0"
          width="100%"
          readOnly={readOnly}
          error={!!explorerUrlError}
          errorMessage={explorerUrlError}
        />
        {!readOnly && action === 'edit' && (
          <CSSTransition timeout={500} classNames="item" appear in exit>
            <IconContainer isEdit={!readOnly}>
              <PencilIcon color={theme.colors.text1} width={14} />
            </IconContainer>
          </CSSTransition>
        )}
      </InputContainer>
      <InputContainer>
        <StyledInput
          onChange={(e) => {
            e.stopPropagation();
            handleUpdate({
              ...customNetwork,
              logoUri: e.target.value,
            });
          }}
          value={customNetwork.logoUri}
          label={t('Logo URL (Optional)')}
          placeholder={t('Enter URL')}
          margin="0 0 16px 0"
          width="100%"
          readOnly={readOnly}
        />
        {!readOnly && action === 'edit' && (
          <CSSTransition timeout={500} classNames="item" appear in exit>
            <IconContainer isEdit={!readOnly}>
              <PencilIcon color={theme.colors.text1} width={14} />
            </IconContainer>
          </CSSTransition>
        )}
      </InputContainer>
    </VerticalFlex>
  );
};
