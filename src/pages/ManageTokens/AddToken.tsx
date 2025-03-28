import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PageTitle } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { AddCustomTokenHandler } from '@src/background/services/settings/handlers/addCustomToken';
import { GetTokenDataHandler } from '@src/background/services/settings/handlers/getTokenDataByAddress';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Stack,
  TextField,
  Typography,
  toast,
} from '@avalabs/core-k2-components';
import { TokenCardWithBalance } from '@src/components/common/TokenCardWithBalance';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { TokenType, TokenWithBalanceERC20 } from '@avalabs/vm-module-types';
import { isTokenMalicious } from '@src/utils/isTokenMalicious';
import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { MaliciousTokenWarningBox } from '@src/components/common/MaliciousTokenWarning';

export function AddToken() {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { network } = useNetworkContext();
  const tokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
  });
  const history = useHistory();

  const [addressInput, setAddressInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newTokenData, setNewTokenData] = useState<NetworkContractToken>();
  const [error, setError] = useState<string>('');
  const { capture } = useAnalyticsContext();

  const addCustomToken = async () => {
    if (!addressInput) return;
    try {
      const success = await request<AddCustomTokenHandler>({
        method: ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN,
        params: [addressInput],
      });
      if (success) {
        toast.success(t('Token Added'), { duration: 2000 });
      }
      capture('ManageTokensAddCustomToken', {
        status: 'success',
        address: addressInput,
      });
      history.goBack();
    } catch (_err) {
      capture('ManageTokensAddCustomToken', {
        status: 'failed',
        address: addressInput,
      });
      toast.error(t('Failed.'), { duration: 2000 });
    }
  };

  const existingToken = useMemo(
    () =>
      tokens.find(
        (token) =>
          token.type === TokenType.ERC20 &&
          token.address.toLowerCase() === addressInput.toLowerCase(),
      ) as TokenWithBalanceERC20 | undefined,
    [tokens, addressInput],
  );

  useEffect(() => {
    if (!addressInput.length) {
      setNewTokenData(undefined);
      setError('');
      return;
    }

    const getTokenData = async () => {
      if (existingToken) {
        setError(t('Token already exists in your wallet.'));
        return;
      }

      setIsLoading(true);
      const data = await request<GetTokenDataHandler>({
        method: ExtensionRequest.SETTINGS_GET_TOKEN_DATA,
        params: [addressInput],
      });
      setIsLoading(false);

      if (!data) {
        setError(t('Not a valid ERC-20 token address.'));
        setNewTokenData(undefined);
        return;
      }
      setError('');
      setNewTokenData(data);
    };

    getTokenData();
  }, [request, addressInput, network, existingToken, t]);

  const tokenData = useMemo(
    () => existingToken ?? newTokenData,
    [existingToken, newTokenData],
  );

  return (
    <>
      <Stack sx={{ flex: 1, alignItems: 'center' }}>
        <PageTitle>{t('Add Custom Token')}</PageTitle>
        <Stack
          sx={{
            flexGrow: 1,
            width: '100%',
            pt: 1,
            px: 2,
            pb: 3,
          }}
        >
          <TextField
            data-testid="add-custom-token-address-input"
            size="small"
            multiline
            fullWidth
            rows={2}
            label={t('Custom Token Address')}
            value={addressInput}
            placeholder={t('Enter an Address')}
            onChange={(e) =>
              setAddressInput((e.nativeEvent.target as HTMLInputElement).value)
            }
            error={!!error}
            helperText={error}
          />
          {tokenData && (
            <>
              <Stack sx={{ mt: 5, rowGap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'fontWeightSemibold',
                  }}
                >
                  {t('Token')}
                </Typography>
                {isTokenMalicious(tokenData) && <MaliciousTokenWarningBox />}
                <TokenCardWithBalance
                  name={tokenData.name}
                  symbol={tokenData.symbol}
                  isMalicious={isTokenMalicious(tokenData)}
                >
                  <TokenIcon width="32px" height="32px" name={tokenData.name} />
                </TokenCardWithBalance>
              </Stack>
            </>
          )}
          <Stack
            sx={{
              flexGrow: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button
              data-testid="add-custom-token-button"
              onClick={addCustomToken}
              disabled={isLoading || !!error?.length || !newTokenData}
              fullWidth
              size="large"
            >
              {t('Add Token')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
