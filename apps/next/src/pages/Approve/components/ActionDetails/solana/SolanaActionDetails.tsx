import { Stack } from '@avalabs/k2-alpine';

import { SolanaNetwork } from '@core/types';

import { ActionDetailsProps } from '../../../types';
import { DetailsItem } from '../generic/DetailsItem';
import { DetailsSection } from '../generic/DetailsSection';
import { TransactionBalanceChange } from '../generic/TransactionBalanceChange';

type SolanaActionDetailsProps = Omit<ActionDetailsProps, 'network'> & {
  network: SolanaNetwork;
};

export const SolanaActionDetails = ({ action }: SolanaActionDetailsProps) => {
  return (
    <Stack gap={1}>
      <TransactionBalanceChange
        ins={action.displayData.balanceChange?.ins ?? []}
        outs={action.displayData.balanceChange?.outs ?? []}
        isSimulationSuccessful={action.displayData.isSimulationSuccessful}
      />
      {action.displayData.details.map((section) => (
        <DetailsSection key={section.title}>
          {section.items.map((item, itemIndex) => (
            <DetailsItem key={itemIndex} item={item} />
          ))}
        </DetailsSection>
      ))}
    </Stack>
  );
};
