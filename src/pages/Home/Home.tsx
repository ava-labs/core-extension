import { Portfolio } from './components/Portfolio/Portfolio';
import { LedgerWrongVersionOverlay } from '../Ledger/LedgerWrongVersionOverlay';
import { Stack } from '@avalabs/k2-components';

export function Home() {
  return (
    <>
      <Stack sx={{ width: '100%', flexGrow: 1 }}>
        <Portfolio />
      </Stack>
      <LedgerWrongVersionOverlay />
    </>
  );
}
