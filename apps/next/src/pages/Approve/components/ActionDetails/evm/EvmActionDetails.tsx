import { Stack } from '@avalabs/k2-alpine';

import { EvmNetwork } from '@core/types';

import { ActionDetailsProps } from '../../../types';
import { DetailsSection } from '../generic/DetailsSection';
import { DetailsItem } from '../generic/DetailsItem';

type EvmActionDetailsProps = Omit<ActionDetailsProps, 'network'> & {
  network: EvmNetwork;
};

export const EvmActionDetails = ({ action }: EvmActionDetailsProps) => {
  return (
    <Stack gap={1}>
      {action.displayData.details.map((section) => (
        <DetailsSection key={section.title}>
          {section.items.map((item, index) => (
            <DetailsItem key={index} item={item} />
          ))}
        </DetailsSection>
      ))}
    </Stack>
  );
};
