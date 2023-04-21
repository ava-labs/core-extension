import {
  ComponentSize,
  PrimaryButton,
  TextArea,
  TokenCard,
  VerticalFlex,
} from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { PageTitle } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenType } from '@src/background/services/balances/models';
import { AddCustomTokenHandler } from '@src/background/services/settings/handlers/addCustomToken';
import { GetTokenDataHandler } from '@src/background/services/settings/handlers/getTokenDataByAddress';
import { useTranslation } from 'react-i18next';
import { toast } from '@avalabs/k2-components';

const AddressInput = styled(TextArea)`
  word-break: break-all;
`;

export function AddToken() {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { network } = useNetworkContext();
  const tokens = useTokensWithBalances(true);
  const history = useHistory();

  const [addressInput, setAddressInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenData, setTokenData] = useState<{
    name: string;
    symbol: string;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const { capture } = useAnalyticsContext();

  const addCustomToken = async () => {
    if (!addressInput) return;
    try {
      const success = await request<AddCustomTokenHandler>({
        method: ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN,
        params: [addressInput],
      });
      success && toast.success(t('Added!'), { duration: 2000 });
      capture('ManageTokensAddCustomToken', {
        status: 'success',
        address: addressInput,
      });
      history.goBack();
    } catch (err) {
      capture('ManageTokensAddCustomToken', {
        status: 'failed',
        address: addressInput,
      });
      toast.error(t('Failed.'), { duration: 2000 });
    }
  };

  const tokenAlreadyExists = useMemo(
    () =>
      addressInput?.length &&
      tokens.some(
        (token) =>
          token.type === TokenType.ERC20 &&
          token.address.toLowerCase() === addressInput.toLowerCase()
      ),
    [tokens, addressInput]
  );

  useEffect(() => {
    if (!addressInput?.length) {
      setTokenData(null);
      setError('');
      return;
    }

    const getTokenData = async () => {
      setIsLoading(true);
      const tokenData = await request<GetTokenDataHandler>({
        method: ExtensionRequest.SETTINGS_GET_TOKEN_DATA,
        params: [addressInput],
      });
      setIsLoading(false);
      setTokenData(tokenData || null);

      let errorMessage = '';
      if (!tokenData) {
        errorMessage = t('Not a valid ERC-20 token address.');
      }
      if (tokenAlreadyExists) {
        errorMessage = t('Token already exists in your wallet.');
      }
      setError(errorMessage);
    };
    getTokenData();
  }, [request, addressInput, network, tokenAlreadyExists, t]);

  return (
    <>
      <VerticalFlex flex={1} align="center">
        <PageTitle>{t('Add Custom Token')}</PageTitle>
        <VerticalFlex
          grow="1"
          align="center"
          width="100%"
          padding="8px 16px 24px 16px"
        >
          <AddressInput
            data-testid="add-custom-token-address-input"
            size={ComponentSize.SMALL}
            margin="12px 0 10px 0"
            label={t('Custom Token Address')}
            value={addressInput}
            placeholder={t('Enter an address')}
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
              data-testid="add-custom-token-button"
              size={ComponentSize.LARGE}
              onClick={addCustomToken}
              disabled={isLoading || !!error?.length || !tokenData}
            >
              {t('Add Token')}
            </PrimaryButton>
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>
    </>
  );
}
