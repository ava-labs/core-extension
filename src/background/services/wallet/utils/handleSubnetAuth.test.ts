import { utils, pvmSerial } from '@avalabs/avalanchejs-v2';
import { handleSubnetAuth, isSubnetTx } from './handleSubnetAuth';

jest.mock('@avalabs/avalanchejs-v2');

describe('src/background/services/wallet/utils/handleSubnetAuth', () => {
  describe('isSubnetTx', () => {
    const txMock = {} as any;

    beforeEach(() => {
      (pvmSerial.isCreateChainTx as unknown as jest.Mock).mockReturnValue(
        false
      );
      (
        pvmSerial.isAddSubnetValidatorTx as unknown as jest.Mock
      ).mockReturnValue(false);
    });

    it('returns false for non-subnet transactions', () => {
      expect(isSubnetTx(txMock)).toBe(false);
    });

    it('returns true for create chain transactions', () => {
      (pvmSerial.isCreateChainTx as unknown as jest.Mock).mockReturnValueOnce(
        true
      );
      expect(isSubnetTx(txMock)).toBe(true);
    });

    it('returns true for add subnet validator transactions', () => {
      (
        pvmSerial.isAddSubnetValidatorTx as unknown as jest.Mock
      ).mockReturnValueOnce(true);
      expect(isSubnetTx(txMock)).toBe(true);
    });
  });

  describe('handleSubnetAuth', () => {
    const subnetIdMock = 'subnetId';
    const subnetOwnersMock = {
      addrs: [
        {
          address: 'owner1',
        },
        {
          address: 'owner2',
        },
        {
          address: 'owner3',
        },
      ],
    };

    const getTxMock = jest.fn();
    const txMock = {
      getSubnetID: () => ({
        value: () => subnetIdMock,
      }),
    } as any;
    const providerMock = {
      getApiP: jest.fn(() => ({
        getTx: getTxMock,
      })),
    } as any;

    it('extends the provided addressMaps correctly', async () => {
      getTxMock.mockResolvedValueOnce({
        unsignedTx: {
          getSubnetOwners: () => subnetOwnersMock,
        },
      });

      const addressMaps = [
        { notOwner1: [[0, 1]] },
        { notOwner2: [[0, 2]] },
      ] as any;

      const result = await handleSubnetAuth({
        tx: txMock,
        provider: providerMock,
        addressMaps,
      });

      expect(result).toStrictEqual([
        addressMaps[0],
        addressMaps[1],
        (utils.AddressMap as unknown as jest.Mock).mock.instances[0],
      ]);
      expect(getTxMock).toHaveBeenCalledWith({ txID: subnetIdMock });
    });
  });
});
