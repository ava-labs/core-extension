import {
  BalanceChange,
  NetworkContractToken,
  NetworkToken,
} from '@avalabs/vm-module-types';
import { FC } from 'react';

import { DetailsSection } from '../DetailsSection';
import {
  BatchTokenBalanceChange,
  SingleTokenBalanceChange,
} from './components';

type TransactionBalanceChangeProps = BalanceChange & {
  isSimulationSuccessful?: boolean;
};

export const TransactionBalanceChange: FC<TransactionBalanceChangeProps> = ({
  ins,
  outs,
}) => {
  // TODO: Add the warnings below -- to be defined by the UX team.
  // const hasSentItems = outs.length > 0;
  // const hasReceivedItems = ins.length > 0;
  // const showNoPreExecWarning = isSimulationSuccessful === false; // may be undefined
  // const showNoDataWarning =
  //   !hasSentItems && !hasReceivedItems && !isSimulationSuccessful;

  return (
    <DetailsSection>
      {outs.map(({ token, items }) =>
        items.length === 1 ? (
          <SingleTokenBalanceChange
            key={isNetworkContractToken(token) ? token.address : token.symbol}
            token={token}
            item={items[0]!}
            direction="loss"
          />
        ) : (
          <BatchTokenBalanceChange
            key={isNetworkContractToken(token) ? token.address : token.symbol}
            token={token}
            items={items}
            direction="loss"
          />
        ),
      )}
      {ins.map(({ token, items }) =>
        items.length === 1 ? (
          <SingleTokenBalanceChange
            key={isNetworkContractToken(token) ? token.address : token.symbol}
            token={token}
            item={items[0]!}
            direction="gain"
          />
        ) : (
          <BatchTokenBalanceChange
            key={isNetworkContractToken(token) ? token.address : token.symbol}
            token={token}
            items={items}
            direction="gain"
          />
        ),
      )}
    </DetailsSection>
  );
};

const isNetworkContractToken = (
  token: NetworkToken | NetworkContractToken,
): token is NetworkContractToken => {
  return 'address' in token;
};
