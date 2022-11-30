import { BridgeConfig } from '@avalabs/bridge-sdk';
import { Account } from '@src/background/services/accounts/models';
import { isAddressBlocklisted } from './isAddressBlocklisted';

describe('pages/Bridge/utils/isAddressWhitelisted.ts', () => {
  describe('isAddressBlocklisted', () => {
    const account = {
      index: 1,
      addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      addressBTC: '0x0000000000000000000000000000000000000000',
    } as Account;

    it('addresses shoud be NOT blocked', async () => {
      const bridgeConfigMock = {
        config: {
          critical: {
            addressBlocklist: ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1'],
          },
          criticalBitcoin: {
            addressBlocklist: ['0x0000000000000000000000000000000000000001'],
          },
        },
      } as BridgeConfig;

      const result = isAddressBlocklisted(account, bridgeConfigMock);
      expect(result).toEqual(false);
    });
    it('address C shoud be blocked', async () => {
      const bridgeConfigMock = {
        config: {
          critical: {
            addressBlocklist: ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
          },
          criticalBitcoin: {
            addressBlocklist: ['0x0000000000000000000000000000000000000001'],
          },
        },
      } as BridgeConfig;

      const result = isAddressBlocklisted(account, bridgeConfigMock);
      expect(result).toEqual(true);
    });
    it('address BTC shoud be blocked', async () => {
      const bridgeConfigMock = {
        config: {
          critical: {
            addressBlocklist: ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1'],
          },
          criticalBitcoin: {
            addressBlocklist: ['0x0000000000000000000000000000000000000000'],
          },
        },
      } as BridgeConfig;

      const result = isAddressBlocklisted(account, bridgeConfigMock);
      expect(result).toEqual(true);
    });
  });
});
