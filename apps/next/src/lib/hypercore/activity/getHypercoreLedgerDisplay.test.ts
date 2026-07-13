import type { HypercoreLedgerUpdate } from '../schemas';
import { getHypercoreLedgerDisplay } from './getHypercoreLedgerDisplay';

const OWNER = '0x7962b519399e541f9c0d69ea2437916c243bb530';
const OTHER = '0xf70da97812cb96acdf810712aa562db8dfa3dbef';

const update = (
  delta: HypercoreLedgerUpdate['delta'],
): HypercoreLedgerUpdate => ({
  time: 1,
  hash: '0xabc',
  delta,
});

describe('getHypercoreLedgerDisplay', () => {
  it('marks deposits as positive USDC into the owner', () => {
    const display = getHypercoreLedgerDisplay(
      update({ type: 'deposit', usdc: '5.0' }),
      OWNER,
    );
    expect(display).toMatchObject({
      label: 'deposit',
      direction: 'positive',
      amount: '5',
      symbol: 'USDC',
      usdValue: 5,
      to: OWNER,
    });
    expect(display.from).toBeUndefined();
  });

  it('marks withdrawals as negative USDC out of the owner', () => {
    const display = getHypercoreLedgerDisplay(
      update({ type: 'withdraw', usdc: '10.0' }),
      OWNER,
    );
    expect(display).toMatchObject({
      label: 'withdraw',
      direction: 'negative',
      amount: '10',
      symbol: 'USDC',
      usdValue: -10,
      from: OWNER,
    });
  });

  it('keeps the real from/to on an outgoing send and signs the value negative', () => {
    const display = getHypercoreLedgerDisplay(
      update({
        type: 'send',
        token: 'USDC',
        amount: '4.98',
        usdcValue: '4.98',
        user: OWNER,
        destination: OTHER,
      }),
      OWNER,
    );
    expect(display).toMatchObject({
      label: 'sent',
      direction: 'negative',
      amount: '4.98',
      symbol: 'USDC',
      usdValue: -4.98,
      from: OWNER,
      to: OTHER,
    });
  });

  it('keeps the real from/to on an incoming send and signs the value positive', () => {
    const display = getHypercoreLedgerDisplay(
      update({
        type: 'send',
        token: 'USDC',
        amount: '3.77',
        usdcValue: '3.77',
        user: OTHER,
        destination: OWNER,
      }),
      OWNER,
    );
    expect(display).toMatchObject({
      label: 'received',
      direction: 'positive',
      usdValue: 3.77,
      from: OTHER,
      to: OWNER,
    });
  });

  it('labels account class transfers by destination account, without a sign', () => {
    expect(
      getHypercoreLedgerDisplay(
        update({ type: 'accountClassTransfer', usdc: '2', toPerp: true }),
        OWNER,
      ),
    ).toMatchObject({
      label: 'transferToPerp',
      direction: 'neutral',
      amount: '2',
      symbol: 'USDC',
      usdValue: 2,
    });
    expect(
      getHypercoreLedgerDisplay(
        update({ type: 'accountClassTransfer', usdc: '2', toPerp: false }),
        OWNER,
      ),
    ).toMatchObject({ label: 'transferToSpot' });
  });

  it('falls back to a generic row for unmodelled delta types', () => {
    const display = getHypercoreLedgerDisplay(
      update({ type: 'vaultDeposit', usdcValue: '100' }),
      OWNER,
    );
    expect(display).toMatchObject({
      label: 'other',
      rawType: 'vaultDeposit',
      direction: 'neutral',
      amount: '100',
      symbol: 'USDC',
    });
  });
});
