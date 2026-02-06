import { FC, useMemo } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import {
  DetailItem,
  DetailItemType,
  DisplayData,
} from '@avalabs/vm-module-types';

import { AvalancheNetwork, Action } from '@core/types';
import { useAccountsContext } from '@core/ui';

import { DetailsItem } from '../../generic/DetailsItem';
import { DetailsSection } from '../../generic/DetailsSection';
import { AddressDetail } from '../../generic/DetailsItem/items/AddressDetail';
import { NetworkDetail } from '../../generic/DetailsItem/items/NetworkDetail';
import { getAddressByVMType } from '@core/common';

type DelegatorDetailsProps = {
  action: Action<DisplayData>;
  network: AvalancheNetwork;
};

// Labels to keep for delegator transaction details
const DELEGATOR_LABELS_TO_KEEP = [
  'Node ID',
  'Stake Amount',
  'Start Date',
  'End Date',
];

const filterDelegatorDetails = (items: DetailItem[]): DetailItem[] => {
  return items
    .filter((item) => {
      if (typeof item === 'string') return false;
      return DELEGATOR_LABELS_TO_KEEP.includes(item.label);
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

export const DelegatorDetails: FC<DelegatorDetailsProps> = ({
  action,
  network,
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
  console.log('address', address);
  const account = address ? getAccount(address) : undefined;
  console.log('account', account);
  const accountName = account?.name ?? 'Account';
  console.log('accountName', accountName);
  // Get transaction details (Node, stake amount, start, end)
  const transactionDetails = useMemo(() => {
    const allItems: DetailItem[] = [];
    action.displayData.details.forEach((section) => {
      const filtered = filterDelegatorDetails(section.items);
      allItems.push(...filtered);
    });
    return allItems;
  }, [action.displayData.details]);

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

      {/* Section 2: Transaction Details (Node, Stake, Start, End) */}
      {transactionDetails.length > 0 && (
        <DetailsSection>
          {transactionDetails.map((item, index) => (
            <DetailsItem key={index} item={item} network={network} />
          ))}
        </DetailsSection>
      )}
    </Stack>
  );
};

export default DelegatorDetails;
