import { Erc20TokenData } from '@avalabs/avalanche-wallet-sdk/dist/Asset/types';
import {
  ComponentSize,
  PrimaryButton,
  TextArea,
  TokenCard,
  VerticalFlex,
  toast,
} from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/models';
import {
  PageContentMiniMode,
  PageTitleMiniMode,
} from '@src/pages/ManageTokens/Page.minimode';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useHistory } from 'react-router-dom';

const AddressInput = styled(TextArea)`
  word-break: break-all;
`;

export function AddToken() {
  const { request } = useConnectionContext();
  const { network } = useNetworkContext();
  const { erc20Tokens } = useWalletContext();
  const history = useHistory();

  const [addressInput, setAddressInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenData, setTokenData] = useState<Erc20TokenData | null>(null);
  const [error, setError] = useState<string>('');

  const addCustomToken = async () => {
    if (!addressInput) return;
    try {
      const success = await request({
        method: ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN,
        params: [addressInput],
      });
      success && toast.success('Added!');
      history.goBack();
    } catch (err) {
      toast.error('Failed.');
    }
  };

  const tokenAlreadyExists = useMemo(
    () =>
      addressInput?.length &&
      erc20Tokens.some(({ address }) => address === addressInput),
    [erc20Tokens, addressInput]
  );

  useEffect(() => {
    if (!addressInput?.length) {
      setTokenData(null);
      setError('');
      return;
    }

    const getTokenData = async () => {
      setIsLoading(true);
      const tokenData = await request({
        method: ExtensionRequest.SETTINGS_GET_TOKEN_DATA,
        params: [addressInput],
      });
      setIsLoading(false);
      setTokenData(tokenData || null);

      let errorMessage = '';
      if (!tokenData) {
        errorMessage = 'Invalid ERC-20 token address.';
      }
      if (tokenAlreadyExists) {
        errorMessage = 'Token already exists in your wallet.';
      }
      setError(errorMessage);
    };
    getTokenData();
  }, [request, addressInput, network, tokenAlreadyExists]);

  return (
    <>
      <VerticalFlex flex={1} align="center">
        <PageTitleMiniMode showBack>Add custom token</PageTitleMiniMode>
        <PageContentMiniMode>
          <AddressInput
            size={ComponentSize.SMALL}
            margin="12px 0 10px 0"
            label={'Address'}
            value={addressInput}
            placeholder="Enter the address"
            onChange={(e) =>
              setAddressInput((e.nativeEvent.target as HTMLInputElement).value)
            }
            error={!!error}
            errorMessage={error}
          />
          {tokenData && (
            <TokenCard name={tokenData.name} symbol={tokenData.symbol}>
              <TokenIcon width="32px" height="32px" name={tokenData.name} />
            </TokenCard>
          )}
          <VerticalFlex grow="1" justify="flex-end" align="center">
            <PrimaryButton
              size={ComponentSize.LARGE}
              onClick={addCustomToken}
              disabled={isLoading || !!error?.length || !tokenData}
            >
              Add token
            </PrimaryButton>
          </VerticalFlex>
        </PageContentMiniMode>
      </VerticalFlex>
    </>
  );
}

export default AddToken;
