import { FC, useMemo } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';

import { AvalancheNetwork, AvalancheNewTransactionRequest } from '@core/types';

import { ActionDetailsProps } from '../../../types';
import { DetailsItem } from '../generic/DetailsItem';
import { DetailsSection } from '../generic/DetailsSection';
import ValidatorDetails from './components/ValidatorDetails';
import DelegatorDetails from './components/DelegatorDetails';

type AvalancheTransactionDetailsProps = Omit<ActionDetailsProps, 'network'> & {
  network: AvalancheNetwork;
};

const getAvalancheTx = (signingData: unknown): Avalanche.Tx | undefined => {
  const data = signingData as AvalancheNewTransactionRequest | undefined;
  if (
    data?.type === RpcMethod.AVALANCHE_SEND_TRANSACTION ||
    data?.type === RpcMethod.AVALANCHE_SIGN_TRANSACTION
  ) {
    return data.data;
  }
  return undefined;
};

export const AvalancheTransactionDetails: FC<
  AvalancheTransactionDetailsProps
> = ({ action, network }) => {
  const tx = useMemo(
    () => getAvalancheTx(action.signingData),
    [action.signingData],
  );

  const isAddingValidator = tx && Avalanche.isAddPermissionlessValidatorTx(tx);
  const isAddingDelegator = tx && Avalanche.isAddPermissionlessDelegatorTx(tx);

  // validator - filter and rename labels from displayData
  if (isAddingValidator) {
    return <ValidatorDetails action={action} network={network} />;
  }

  // delegator - uses the pre-formatted details from displayData
  if (isAddingDelegator) {
    return <DelegatorDetails action={action} network={network} />;
  }

  // others
  return (
    <Stack gap={1}>
      {action.displayData.details.map((section) => (
        <DetailsSection key={section.title}>
          {section.items.map((item, index) => (
            <DetailsItem key={index} item={item} network={network} />
          ))}
        </DetailsSection>
      ))}
    </Stack>
  );
};
