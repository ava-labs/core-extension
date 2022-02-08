import { UTXOSet } from 'avalanche/dist/apis/platformvm';
import { useUnlockingSchedule } from '../../hooks/useUnlockingSchedule';
import {
  GridContainer,
  GridContainerItems,
  Typography,
  GridLineSeparator,
} from '@avalabs/react-components';
import { BN, bnToAvaxP } from '@avalabs/avalanche-wallet-sdk';

function bnToDate(val: BN) {
  const date = new Date(val.toNumber() * 1000);
  return date.toLocaleString();
}

export function UnlockingSchedule({ utxoSet }: { utxoSet: UTXOSet }) {
  const lockOuts = useUnlockingSchedule(utxoSet);
  const gridColumns = 2;

  return (
    <GridContainer columns={gridColumns}>
      <GridContainerItems>
        <Typography>Unlock Date</Typography>
        <Typography>Amount</Typography>
      </GridContainerItems>
      <GridLineSeparator columns={gridColumns} />
      {lockOuts.map((out, index) => (
        <GridContainerItems key={index}>
          <Typography>{bnToDate(out.getStakeableLocktime())}</Typography>
          <Typography>{bnToAvaxP(out.getAmount())} AVAX</Typography>
        </GridContainerItems>
      ))}
    </GridContainer>
  );
}
