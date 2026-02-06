import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { DetailItem, DisplayData } from '@avalabs/vm-module-types';

import { AvalancheNetwork } from '@core/types';
import { Action } from '@core/types';

import { DetailsItem } from '../../generic/DetailsItem';
import { DetailsSection } from '../../generic/DetailsSection';

type ValidatorDetailsProps = {
  action: Action<DisplayData>;
  network: AvalancheNetwork;
};

// Labels to exclude from validator details
const VALIDATOR_LABELS_TO_EXCLUDE = ['Subnet ID', 'Public Key', 'Proof'];

const convertToValidatorDetails = (items: DetailItem[]): DetailItem[] => {
  return items
    .filter((item) => {
      if (typeof item === 'string') return false;
      return !VALIDATOR_LABELS_TO_EXCLUDE.includes(item.label);
    })
    .map((item) => {
      // Rename "Node ID" to "Node"
      if (typeof item !== 'string' && item.label === 'Node ID') {
        return { ...item, label: 'Node' };
      }

      if (typeof item !== 'string' && item.label === 'Start Date') {
        return { ...item, label: 'Start' };
      }

      if (typeof item !== 'string' && item.label === 'End Date') {
        return { ...item, label: 'End' };
      }
      return item;
    });
};

export const ValidatorDetails: FC<ValidatorDetailsProps> = ({
  action,
  network,
}) => {
  return (
    <Stack gap={1}>
      {action.displayData.details.map((section) => {
        const filteredItems = convertToValidatorDetails(section.items);
        if (filteredItems.length === 0) {
          return null;
        }
        return (
          <DetailsSection key={section.title}>
            {filteredItems.map((item, index) => (
              <DetailsItem key={index} item={item} network={network} />
            ))}
          </DetailsSection>
        );
      })}
    </Stack>
  );
};

export default ValidatorDetails;
