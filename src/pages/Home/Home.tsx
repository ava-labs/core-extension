import { FAB } from '@src/components/common/fab/FAB';
import { Portfolio } from './components/Portfolio/Portfolio';
import { LedgerWrongVersionOverlay } from '../Ledger/LedgerWrongVersionOverlay';
import { Stack } from '@avalabs/k2-components';

export function Home() {
  return (
    <>
      <Stack sx={{ width: '100%' }}>
        <Portfolio />
        <FAB />
      </Stack>
      <LedgerWrongVersionOverlay />
    </>
  );
}
