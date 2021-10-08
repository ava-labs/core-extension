import {
  VerticalFlex,
  Card,
  HorizontalFlex,
  Typography,
} from '@avalabs/react-components';
import { DestinationChainTx } from '@avalabs/wallet-react-components';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import React from 'react';

function stepParser(tx: DestinationChainTx) {
  const [direction, from, to] = tx.action.split('_');
  const amountDisplayValue = tx.amount
    ? Utils.bnToAvaxX(new BN(tx.amount, 'hex'))
    : '';
  const sendFeeDisplayValue = Utils.bnToAvaxX(Utils.getTxFeeX() as any);
  return {
    ...tx,
    direction,
    from,
    to,
    amountDisplayValue,
    sendFeeDisplayValue,
  };
}

export function SendConsolidationDetails({
  txs,
}: {
  txs: DestinationChainTx[];
}) {
  return (
    <Card>
      <VerticalFlex width={'100%'}>
        {txs
          .map(stepParser)
          .map(
            (
              { direction, from, to, amountDisplayValue, sendFeeDisplayValue },
              idx
            ) => {
              return (
                <HorizontalFlex
                  key={idx}
                  width={'100%'}
                  justify={'space-between'}
                  align={'center'}
                  margin={'0 0 20px 0'}
                >
                  <VerticalFlex>
                    <Typography>
                      {direction} {amountDisplayValue} AVAX
                    </Typography>
                    <Typography>
                      from {from} to {to}
                    </Typography>
                  </VerticalFlex>
                  <HorizontalFlex>
                    <Typography>{sendFeeDisplayValue}</Typography>
                  </HorizontalFlex>
                </HorizontalFlex>
              );
            }
          )}
      </VerticalFlex>
    </Card>
  );
}
