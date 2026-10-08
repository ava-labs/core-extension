import { FC } from 'react';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { Stack } from '@avalabs/k2-alpine';
import { RpcMethod, SigningData } from '@avalabs/vm-module-types';

import { AvalancheNetwork } from '@core/types';

import { ActionDetailsProps } from '../../../types';
import { DetailsItem } from '../generic/DetailsItem';
import { DetailsSection } from '../generic/DetailsSection';

type AvalancheTransactionDetailsProps = Omit<ActionDetailsProps, 'network'> & {
  network: AvalancheNetwork;
};

const _isBaseTx = (signingData?: SigningData) =>
  (signingData?.type === RpcMethod.AVALANCHE_SEND_TRANSACTION ||
    signingData?.type === RpcMethod.AVALANCHE_SIGN_TRANSACTION) &&
  Avalanche.isBaseTx(signingData.data);

export const AvalancheTransactionDetails: FC<
  AvalancheTransactionDetailsProps
> = ({ action, network }) => {
  const isBaseTx = _isBaseTx(action.signingData);

  return (
    <Stack gap={1}>
      {action.displayData.details.map((section, sectionIndex) => (
        <DetailsSection key={sectionIndex} heading={section.title}>
          {section.items.map((item, index) => (
            <DetailsItem
              key={index}
              item={item}
              network={network}
              areGroupsOpenByDefault={isBaseTx}
            />
          ))}
        </DetailsSection>
      ))}
    </Stack>
  );
};
