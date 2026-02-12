import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';

import { AvalancheNetwork } from '@core/types';

import { ActionDetailsProps } from '../../../types';
import { DetailsItem } from '../generic/DetailsItem';
import { DetailsSection } from '../generic/DetailsSection';
import { DetailItemType } from '@avalabs/vm-module-types';

type AvalancheTransactionDetailsProps = Omit<ActionDetailsProps, 'network'> & {
  network: AvalancheNetwork;
};

export const AvalancheTransactionDetails: FC<
  AvalancheTransactionDetailsProps
> = ({ action, network }) => {
  return (
    <Stack gap={1}>
      {action.displayData.details.map((section) => (
        <DetailsSection key={section.title}>
          {section.items.map((item, index) => (
            <DetailsItem
              key={index}
              item={item}
              network={network}
              simpleDetailsItems={[DetailItemType.ADDRESS]}
            />
          ))}
        </DetailsSection>
      ))}
    </Stack>
  );
};
