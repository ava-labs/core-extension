import {
  VerticalFlex,
  HorizontalFlex,
  Typography,
} from '@avalabs/react-components';
import { DestinationChainTx } from '@avalabs/wallet-react-components';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';

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
    <VerticalFlex width={'100%'}>
      <Scrollbars>
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
                  width="100%"
                  justify="space-between"
                  align="center"
                  padding="0 24px"
                  margin="0 0 24px"
                >
                  <VerticalFlex>
                    <Typography
                      transform="capitalize"
                      color="text2"
                      size={14}
                      height="17px"
                    >
                      {direction} {amountDisplayValue} AVAX
                    </Typography>
                    <Typography color="text2" size={14} height="17px">
                      from {from.toUpperCase()} to {to.toUpperCase()}
                    </Typography>
                  </VerticalFlex>
                  <HorizontalFlex>
                    <Typography>{sendFeeDisplayValue} AVAX</Typography>
                  </HorizontalFlex>
                </HorizontalFlex>
              );
            }
          )}
      </Scrollbars>
    </VerticalFlex>
  );
}
