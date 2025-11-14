import { WarningMessage } from '@/components/WarningMessage';
import { BitcoinCaip2ChainId } from '@avalabs/core-chains-sdk';
import { Collapse } from '@avalabs/k2-alpine';
import { useIsMainnet } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeQuery } from '../contexts/BridgeQuery';

export const BitcoinBridgeInfo: FC = () => {
  const { t } = useTranslation();
  const { targetNetwork } = useBridgeQuery();
  const isMainnet = useIsMainnet();

  const isTargetBitcoin =
    targetNetwork ===
    (isMainnet ? BitcoinCaip2ChainId.MAINNET : BitcoinCaip2ChainId.TESTNET);

  return (
    <Collapse in={isTargetBitcoin} unmountOnExit>
      <WarningMessage px={0.25}>
        {t('Bridging to Bitcoin can take up to 12 hours')}
      </WarningMessage>
    </Collapse>
  );
};
