import {
  Typography,
  VerticalFlex,
  HorizontalFlex,
  SubTextTypography,
  LoadingSpinnerIcon,
  truncateAddress,
  TextButton,
  CopyIcon,
  toast,
  Card,
  CustomToast,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { BigNumber } from 'ethers';
import Big from 'big.js';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { useTranslation } from 'react-i18next';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useGetTransaction } from '../hooks/useGetTransaction';

export function SuccessFailTxInfo({
  hash,
  gasPrice,
  gasLimit,
  error,
}: {
  hash?: string;
  gasPrice: BigNumber;
  gasLimit: number;
  error?: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const requestId = useGetRequestId();
  const { network } = useGetTransaction(requestId);
  const nativeTokenPrice = useNativeTokenPrice(network);
  const { currencyFormatter } = useSettingsContext();

  const gasCost = new Big(gasPrice.toString()).mul(gasLimit).div(10 ** 18);
  const gasCostUsd = gasCost.mul(nativeTokenPrice || 0);

  if (error) {
    return (
      <VerticalFlex margin="16px 0 0 0" width={'100%'}>
        <Typography size={12} height="15px" margin="0 0 8px 0">
          {t('Error')}:
        </Typography>
        <Card height="105px" padding="16px 0">
          <Scrollbars
            style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
          >
            <VerticalFlex padding="0 16px">
              <Typography size={12} height="17px" wordBreak="break-all">
                {error}
              </Typography>
            </VerticalFlex>
          </Scrollbars>
        </Card>
      </VerticalFlex>
    );
  }

  return (
    <VerticalFlex width="100%" margin="24px 0 0">
      <HorizontalFlex width={'100%'} justify="space-between">
        <HorizontalFlex align="center">
          <Typography size={12} height="15px" margin="0 8px 0 0">
            {t('Network Fee')}
          </Typography>
          <TransactionFeeTooltip
            gasPrice={gasPrice}
            gasLimit={gasLimit}
            network={network}
          />
        </HorizontalFlex>
        <VerticalFlex align="flex-end">
          <Typography size={12} height="15px" margin="0 0 4px 0">
            {gasCost.toLocaleString()} {network?.networkToken.symbol}
          </Typography>
          <SubTextTypography size={12} height="15px">
            {currencyFormatter(gasCostUsd.toNumber())}
          </SubTextTypography>
        </VerticalFlex>
      </HorizontalFlex>
      <HorizontalFlex width={'100%'} justify="space-between" margin="16px 0 0">
        <Typography size={12} height="15px" margin="0 8px 0 0">
          {t('Transaction Hash')}
        </Typography>
        {hash ? (
          <HorizontalFlex align="cetner">
            <Typography size={12} height="15px" margin="0 8px 0 0">
              {truncateAddress(hash, 15)}
            </Typography>
            <TextButton
              onClick={() => {
                navigator.clipboard.writeText(hash);
                toast.custom(<CustomToast label={t('Copied!')} />, {
                  duration: 2000,
                });
              }}
            >
              <CopyIcon color={theme.colors.icon1} height="16px" />
            </TextButton>
          </HorizontalFlex>
        ) : (
          <LoadingSpinnerIcon color={theme.colors.icon1} height="12px" />
        )}
      </HorizontalFlex>
    </VerticalFlex>
  );
}
