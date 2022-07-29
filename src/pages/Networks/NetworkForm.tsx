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

enum FormErrors {
  RPC_ERROR = 'RPC required',
  CHAIN_NAME_ERROR = 'Network Name is required',
  CHAIN_ID_ERROR = 'Chain ID is required',
  TOKEN_SYMBOL_ERROR = 'Network Token Symbol is required',
  EXPLORER_URL_ERROR = 'Explorer URL is requried',
  CHAIN_ID_EXISTS = 'This Chan ID has been added already',
  INVALID_URL = 'This URL is invalid',
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
  return url.protocol === 'https:' || url.protocol === 'ipfs:';
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

      if (!updatedNetwork.explorerUrl) {
        setExplorerUrlError(FormErrors.EXPLORER_URL_ERROR);
        valid = false;
      }
      if (
        updatedNetwork.explorerUrl &&
        !isValidURL(updatedNetwork.explorerUrl)
      ) {
        setExplorerUrlError(FormErrors.INVALID_URL);
        valid = false;
      }

      return valid;
    },
    [action, isChainIdExist]
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
          label="Network RPC URL"
          placeholder="https://URL"
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
          label="Network Name"
          placeholder="Enter Name"
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
          label="Chain ID"
          placeholder="Enter Chain ID"
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
          label="Network Token Symbol"
          placeholder="Enter Token Symbol"
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
          label="Network Token Name (Optional)"
          placeholder="Enter Token"
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
          label="Explorer URL"
          placeholder="Enter URL"
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
          label="Logo URL (Optional)"
          placeholder="Enter URL"
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
