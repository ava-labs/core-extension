import {
  AddDelegatorTx,
  AddValidatorTx,
  AvalancheTx,
  ExportTx,
  ImportTx,
  isAddDelegatorTx,
  isAddValidatorTx,
  isExportTx,
  isImportTx,
} from '@src/background/services/wallet/models';
import { Typography } from '@avalabs/react-components';

export function AvalancheSignTxDetails({ tx }: { tx: AvalancheTx }) {
  if (isAddValidatorTx(tx)) {
    return <AddValidator tx={tx}></AddValidator>;
  } else if (isAddDelegatorTx(tx)) {
    return <AddDelegator tx={tx}></AddDelegator>;
  } else if (isExportTx(tx)) {
    return <ExportTxView tx={tx}></ExportTxView>;
  } else if (isImportTx(tx)) {
    return <ImportTxView tx={tx}></ImportTxView>;
  }
  return <>UNKNOWN TX</>;
}

export function AddValidator({ tx }: { tx: AddValidatorTx }) {
  const start = new Date(parseInt(tx.start) * 1000);
  const end = new Date(parseInt(tx.end) * 1000);
  return (
    <>
      <Typography>ADD VALIDATOR</Typography>
      <Typography>Node ID: {tx.nodeID}</Typography>
      <Typography>Stake Amount: {tx.stake.toString()}</Typography>
      <Typography>
        Start
        <br />
        {start.toLocaleDateString()}
      </Typography>
      <Typography>
        End
        <br />
        {end.toLocaleDateString()}
      </Typography>
    </>
  );
}

export function AddDelegator({ tx }: { tx: AddDelegatorTx }) {
  const start = new Date(parseInt(tx.start) * 1000);
  const end = new Date(parseInt(tx.end) * 1000);
  return (
    <>
      <Typography>ADD VALIDATOR</Typography>
      <Typography>Node ID: {tx.nodeID}</Typography>
      <Typography>Stake Amount: {tx.stake.toString()}</Typography>
      <Typography>
        Start
        <br />
        {start.toLocaleDateString()}
      </Typography>
      <Typography>
        End
        <br />
        {end.toLocaleDateString()}
      </Typography>
    </>
  );
}

export function ExportTxView({ tx }: { tx: ExportTx }) {
  return (
    <>
      <Typography>EXPORT</Typography>
      <Typography>Export to: {tx.destination}</Typography>
      <Typography>Amount: {tx.amount.toString()}</Typography>
    </>
  );
}

export function ImportTxView({ tx }: { tx: ImportTx }) {
  return (
    <>
      <Typography>Import</Typography>
      <Typography>Import from: {tx.source}</Typography>
      <Typography>Amount: {tx.amount.toString()}</Typography>
    </>
  );
}
