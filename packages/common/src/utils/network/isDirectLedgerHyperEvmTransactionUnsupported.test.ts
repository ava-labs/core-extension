import { SecretType } from '@core/types';

import { HYPEREVM_CHAIN_ID, HYPEREVM_CHAIN_NAME } from './isHyperliquidNetwork';
import { isDirectLedgerHyperEvmTransactionUnsupported } from './isDirectLedgerHyperEvmTransactionUnsupported';

describe('isDirectLedgerHyperEvmTransactionUnsupported', () => {
  const hyperEvmNetwork = { chainId: HYPEREVM_CHAIN_ID };

  it('blocks a directly connected Ledger on HyperEVM', () => {
    expect(
      isDirectLedgerHyperEvmTransactionUnsupported(
        hyperEvmNetwork,
        SecretType.Ledger,
      ),
    ).toBe(true);
  });

  it('blocks a directly connected Ledger when HyperEVM is identified by name', () => {
    expect(
      isDirectLedgerHyperEvmTransactionUnsupported(
        { chainId: 1, chainName: HYPEREVM_CHAIN_NAME },
        SecretType.Ledger,
      ),
    ).toBe(true);
  });

  it.each([SecretType.LedgerLive, SecretType.Mnemonic])(
    'does not block %s wallets',
    (secretType) => {
      expect(
        isDirectLedgerHyperEvmTransactionUnsupported(
          hyperEvmNetwork,
          secretType,
        ),
      ).toBe(false);
    },
  );

  it('does not block Ledger transactions on other networks', () => {
    expect(
      isDirectLedgerHyperEvmTransactionUnsupported(
        { chainId: 43114 },
        SecretType.Ledger,
      ),
    ).toBe(false);
  });
});
