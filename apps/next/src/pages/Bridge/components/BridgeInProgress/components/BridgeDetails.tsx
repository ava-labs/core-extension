import { Card } from '@/components/Card';
import { Chain } from '@avalabs/bridge-unified';
import { bigToLocaleString } from '@avalabs/core-utils-sdk';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { bigintToBig } from '@core/common';
import { useNativeTokenPrice } from '@core/ui';
import { useNetworkContext, useSettingsContext } from '@core/ui/src/contexts';
import Big from 'big.js';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationsCounter } from './ConfirmationsRow';
import * as Styled from './Styled';

type Props = {
  networkLabel: string;
  chain: Chain;
  fee: Big | bigint;
  confirmationsRequired: number;
  confirmationsReceived: number;
  error: boolean;
};

export const BridgeDetails: FC<Props> = ({
  networkLabel,
  chain,
  fee,
  confirmationsRequired,
  confirmationsReceived,
  error,
}) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const { getNetwork } = useNetworkContext();
  const network = getNetwork(chain.chainId)!;

  const tokenPrice = useNativeTokenPrice(network);

  const feeBig =
    typeof fee === 'bigint'
      ? bigintToBig(fee, network.networkToken.decimals)
      : fee;

  return (
    <Card noPadding>
      <Styled.RowItem borderTop={1} borderBottom={1} borderColor="transparent">
        <Typography variant="body3" color="text.primary">
          {networkLabel}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box position="relative">
            <Styled.NetworkLogo src={network?.logoUri} alt="Network logo" />
          </Box>
          <Typography variant="body3" color="text.primary">
            {network.chainName}
          </Typography>
        </Stack>
      </Styled.RowItem>
      <Styled.Divider />
      <Styled.RowItem>
        <Typography variant="body3" color="text.primary">
          {t('Network fee amount')}
        </Typography>
        <Stack>
          <Typography variant="body3" color="text.primary" align="right">
            {bigToLocaleString(feeBig)} {network.networkToken.symbol}
          </Typography>
          <Typography variant="caption" color="text.secondary" align="right">
            {fee && tokenPrice
              ? currencyFormatter(feeBig.mul(tokenPrice).toNumber())
              : ''}
          </Typography>
        </Stack>
      </Styled.RowItem>
      <Styled.Divider />
      <Styled.RowItem flexWrap="wrap">
        <ConfirmationsCounter
          required={confirmationsRequired}
          received={confirmationsReceived}
          color={error ? 'error' : 'success'}
        />
      </Styled.RowItem>
    </Card>
  );
};
