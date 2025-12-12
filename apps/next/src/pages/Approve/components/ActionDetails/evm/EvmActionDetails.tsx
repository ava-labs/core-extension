import { Stack } from '@avalabs/k2-alpine';
import { DisplayData } from '@avalabs/vm-module-types';

import { Action, EnsureDefined, EvmNetwork } from '@core/types';

import { ActionDetailsProps } from '../../../types';
import { DetailsItem } from '../generic/DetailsItem';
import { DetailsSection } from '../generic/DetailsSection';
import { TransactionBalanceChange } from '../generic/TransactionBalanceChange';

import { EvmTokenApprovals } from './EvmTokenApprovals';
import { EvmNetworkFeeWidget } from './EvmNetworkFeeWidget';

type EvmActionDetailsProps = Omit<ActionDetailsProps, 'network'> & {
  network: EvmNetwork;
};

export const EvmActionDetails = ({
  action,
  network,
}: EvmActionDetailsProps) => {
  return (
    <Stack gap={1}>
      <TransactionBalanceChange
        ins={action.displayData.balanceChange?.ins ?? []}
        outs={action.displayData.balanceChange?.outs ?? []}
        isSimulationSuccessful={action.displayData.isSimulationSuccessful}
      />
      {hasTokenApprovals(action) && <EvmTokenApprovals action={action} />}
      {action.displayData.details.map((section) => (
        <DetailsSection key={section.title}>
          {section.items.map((item, index) => (
            <DetailsItem key={index} item={item} network={network} />
          ))}
        </DetailsSection>
      ))}
      {action.displayData.networkFeeSelector && (
        <EvmNetworkFeeWidget action={action} network={network} />
      )}
    </Stack>
  );
};

const hasTokenApprovals = (
  action: Action<DisplayData>,
): action is Action<EnsureDefined<DisplayData, 'tokenApprovals'>> => {
  return action.displayData.tokenApprovals !== undefined;
};
