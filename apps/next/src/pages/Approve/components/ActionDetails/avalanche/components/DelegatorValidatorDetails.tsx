import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import {
  DetailItem,
  DetailItemType,
  DisplayData,
} from '@avalabs/vm-module-types';

import { AvalancheNetwork } from '@core/types';
import { Action } from '@core/types';

import { DetailsItem } from '../../generic/DetailsItem';
import { DetailsSection } from '../../generic/DetailsSection';
import { getAddressByVMType } from '@core/common';
import { useAccountsContext } from '@core/ui';
import { AddressDetail } from '../../generic/DetailsItem/items/AddressDetail';
import { NetworkDetail } from '../../generic/DetailsItem/items/NetworkDetail';

type DelegatorValidatorDetailsProps = {
  action: Action<DisplayData>;
  network: AvalancheNetwork;
  labelsToInclude: string[];
};

const convertToValidatorDetails = (
  items: DetailItem[],
  labelsToInclude: string[],
): DetailItem[] => {
  return items
    .filter((item) => {
      if (typeof item === 'string') return false;
      return labelsToInclude.includes(item.label);
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

export const DelegatorValidatorDetails: FC<DelegatorValidatorDetailsProps> = ({
  action,
  network,
  labelsToInclude,
}) => {
  const {
    getAccount,
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const address = action.displayData.account
    ? action.displayData.account
    : activeAccount
      ? getAddressByVMType(activeAccount, network.vmName)
      : undefined;
  const account = address ? getAccount(address) : undefined;
  const accountName = account?.name ?? 'Account';

  return (
    <Stack gap={1}>
      {/* Section 1: Account and Network */}
      <DetailsSection>
        {address && (
          <AddressDetail
            item={{
              label: accountName,
              type: DetailItemType.ADDRESS,
              value: address,
            }}
            network={network}
            forceLabel={true}
          />
        )}
        {action.displayData.network && (
          <NetworkDetail
            item={{
              label: 'Network',
              type: DetailItemType.NETWORK,
              value: {
                logoUri: action.displayData.network.logoUri,
                name: action.displayData.network.name,
              },
            }}
          />
        )}
      </DetailsSection>

      {/* Section 2: Transaction Details */}
      {action.displayData.details.map((section) => {
        const filteredItems = convertToValidatorDetails(
          section.items,
          labelsToInclude,
        );
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
