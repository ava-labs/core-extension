import { Card } from '@/components/Card';
import { Chain } from '@avalabs/bridge-unified';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { useNetworkContext } from '@core/ui/src/contexts';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDone } from 'react-icons/md';
import * as Styled from './Styled';

type Props = {
  type: 'source' | 'target';
  chain: Chain;
  fee: bigint;
  confirmationsRequired: number;
  confirmationsReceived: number;
};

export const BridgeDetails: FC<Props> = ({
  type,
  chain,
  fee,
  confirmationsRequired,
  confirmationsReceived,
}) => {
  const { t } = useTranslation();
  const isConfirmed = confirmationsReceived === confirmationsRequired;
  const { getNetwork } = useNetworkContext();
  const network = getNetwork(chain.chainId);
  return (
    <Card noPadding>
      <Styled.RowItem>
        <Typography variant="body3" color="text.primary">
          {type === 'source' ? t('From') : t('To')}
        </Typography>
        <Typography variant="body3" color="text.primary">
          <img
            src={network?.logoUri}
            width={24}
            height={24}
            alt="Network logo"
          />
          {chain.chainName}
        </Typography>
      </Styled.RowItem>
      <Styled.Divider />
      <Styled.RowItem>
        <Typography variant="body3" color="text.primary">
          {t('Network fee amount')}
        </Typography>
        <Stack>
          <Typography variant="body3" color="text.primary" align="right">
            {fee} AVAX
          </Typography>
          <Typography variant="caption" color="text.secondary" align="right">
            {fee} USD
          </Typography>
        </Stack>
      </Styled.RowItem>
      <Styled.Divider />
      <Stack direction="column">
        <Styled.RowItem>
          <Typography variant="body3" color="text.primary">
            {t('Confirmations')}
          </Typography>
          {isConfirmed ? (
            <MdDone />
          ) : (
            <Typography variant="body3" color="text.primary">
              {t('{{received}} out of {{required}}', {
                received: confirmationsReceived,
                required: confirmationsRequired,
              })}
            </Typography>
          )}
        </Styled.RowItem>
        {!isConfirmed && (
          <Styled.RowItem display="block">
            <Styled.ProgressItem
              variant="determinate"
              color="success"
              value={(confirmationsReceived / confirmationsRequired) * 100}
            />
          </Styled.RowItem>
        )}
      </Stack>
    </Card>
  );
};
