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
import { SimulationAlertBox } from './components/SimulationAlertBox';
import { useTranslation } from 'react-i18next';

type TransactionBalanceChangeProps = BalanceChange & {
  isSimulationSuccessful?: boolean;
};

export const TransactionBalanceChange: FC<TransactionBalanceChangeProps> = ({
  ins,
  outs,
  isSimulationSuccessful,
}) => {
  const { t } = useTranslation();

  const hasSentItems = outs.filter(({ items }) => items.length > 0).length > 0;
  const hasReceivedItems =
    ins.filter(({ items }) => items.length > 0).length > 0;
  const hasSomeBalanceChangeInfo = hasSentItems || hasReceivedItems;
  const showNoPreExecWarning = isSimulationSuccessful === false; // may be undefined
  const showNoDataWarning = hasSomeBalanceChangeInfo && !isSimulationSuccessful;

  return (
    <>
      {hasSomeBalanceChangeInfo && (
        <DetailsSection>
          {outs.map(({ token, items }) =>
            items.length <= 1 ? (
              <SingleTokenBalanceChange
                key={
                  isNetworkContractToken(token) ? token.address : token.symbol
                }
                token={token}
                item={items[0]!}
                direction="loss"
              />
            ) : (
              <BatchTokenBalanceChange
                key={
                  isNetworkContractToken(token) ? token.address : token.symbol
                }
                token={token}
                items={items}
                direction="loss"
              />
            ),
          )}
          {ins
            .filter(({ items }) => items.length > 0)
            .map(({ token, items }) =>
              items.length <= 1 ? (
                <SingleTokenBalanceChange
                  key={
                    isNetworkContractToken(token) ? token.address : token.symbol
                  }
                  token={token}
                  item={items[0]!}
                  direction="gain"
                />
              ) : (
                <BatchTokenBalanceChange
                  key={
                    isNetworkContractToken(token) ? token.address : token.symbol
                  }
                  token={token}
                  items={items}
                  direction="gain"
                />
              ),
            )}
        </DetailsSection>
      )}
      {showNoPreExecWarning && (
        <SimulationAlertBox
          textLines={[
            t('Transaction pre-execution is unavailable.'),
            t('The displayed token list might be incomplete.'),
          ]}
        />
      )}
      {!showNoPreExecWarning && showNoDataWarning && (
        <SimulationAlertBox
          textLines={[
            t('Balance change unavailable.'),
            t('Proceed with caution.'),
          ]}
        />
      )}
    </>
  );
};

const isNetworkContractToken = (
  token: NetworkToken | NetworkContractToken,
): token is NetworkContractToken => {
  return 'address' in token;
};
