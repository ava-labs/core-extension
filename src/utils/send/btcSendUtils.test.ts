import { getMaxTransferAmount } from '@avalabs/wallets-sdk';

import { TokenType } from '@src/background/services/balances/models';

import { validateBtcSend } from './btcSendUtils';
import { SendErrorMessage } from './models';

jest.mock('@avalabs/wallets-sdk');

describe('src/utils/send/btcSendUtils', () => {
  describe('validateBtcSend', () => {
    const fromMainnet = 'bc1q32r4p22fyexux0m0gr8lf8z9entmzu8s4vse7q';
    const fromTestnet = 'tb1q32r4p22fyexux0m0gr8lf8z9entmzu8sl2t29n';

    const toMainnet = 'bc1qkt8x45yzx4pu8pdtwytdtyusfuhyvyyeu9yml4';
    const toTestnet = 'tb1qkt8x45yzx4pu8pdtwytdtyusfuhyvyyekrlgyx';

    const token = {
      symbol: 'BTC',
      decimals: 8,
      type: TokenType.NATIVE,
    } as any;

    it('fails with missing address', () => {
      expect(
        validateBtcSend(
          fromMainnet,
          { address: '', amount: 10_000, feeRate: 25, token },
          [],
          true
        )
      ).toEqual(SendErrorMessage.ADDRESS_REQUIRED);
    });

    it('fails with missing fee rate', () => {
      expect(
        validateBtcSend(
          fromMainnet,
          { address: toMainnet, amount: 10_000, feeRate: 0, token },
          [],
          true
        )
      ).toEqual(SendErrorMessage.INVALID_NETWORK_FEE);
    });

    it('fails when target address does not match provided network', () => {
      expect(
        validateBtcSend(
          fromTestnet,
          { address: toMainnet, amount: 10_000, feeRate: 20, token },
          [],
          false
        )
      ).toEqual(SendErrorMessage.INVALID_ADDRESS);

      expect(
        validateBtcSend(
          fromMainnet,
          { address: toTestnet, amount: 10_000, feeRate: 20, token },
          [],
          true
        )
      ).toEqual(SendErrorMessage.INVALID_ADDRESS);
    });

    it('fails with missing amount', () => {
      expect(
        validateBtcSend(
          fromMainnet,
          { address: toMainnet, amount: 0, feeRate: 20, token },
          [],
          true
        )
      ).toEqual(SendErrorMessage.AMOUNT_REQUIRED);
    });

    it('fails when amount exceeds balance', () => {
      jest.mocked(getMaxTransferAmount).mockReturnValueOnce(10_000);

      const utxos = [{ tx: '0x1234' }, { tx: '0x5678' }] as any;
      const feeRate = 20;

      expect(
        validateBtcSend(
          fromMainnet,
          { address: toMainnet, amount: 20_000, feeRate, token },
          utxos,
          true
        )
      ).toEqual(SendErrorMessage.INSUFFICIENT_BALANCE);

      expect(getMaxTransferAmount).toHaveBeenCalledWith(
        utxos,
        toMainnet,
        fromMainnet,
        feeRate
      );
    });

    it('succeeds with valid parameters', () => {
      jest.mocked(getMaxTransferAmount).mockReturnValueOnce(100_000);

      expect(
        validateBtcSend(
          fromMainnet,
          { address: toMainnet, amount: 20_000, feeRate: 20, token },
          [],
          true
        )
      ).toBe(null);
    });
  });
});
