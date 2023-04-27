import { OutputOwners } from '@avalabs/avalanchejs-v2';
import {
  utils,
  avaxSerial,
  AVM,
  Utxo,
  UnsignedTx,
  TransferableOutput,
} from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';
import createAvalancheUnsignedTx from './createAvalancheUnsignedTx';
import getOutputEmitterTx from './getOutputEmitterTx';
import { handleSubnetAuth, isSubnetTx } from './handleSubnetAuth';

jest.mock('@avalabs/avalanchejs-v2');
jest.mock('./getOutputEmitterTx');
jest.mock('./handleSubnetAuth');

describe('src/background/services/wallet/utils/createAvalancheUnsignedTx', () => {
  const txMock = { foo: 'bar' } as unknown as avaxSerial.AvaxTx;
  const fromAddressBytes = [new Uint8Array([0, 1, 2])];
  const vm = AVM;
  const provider = { foo: 'bar' } as unknown as Avalanche.JsonRpcProvider;

  const addressMapsMock = { storage: [] };
  const credentials = [];

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2008, 10, 31));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    (utils.AddressMaps.fromTransferableInputs as jest.Mock).mockReturnValueOnce(
      addressMapsMock
    );
    (isSubnetTx as jest.Mock).mockReturnValue(false);
  });

  it('returns the correct UnsignedTx instance without fetching utxos', async () => {
    const utxos = [{ assetId: 'assetId' }] as unknown as Utxo[];
    const inputsMock = [];
    (utils.getTransferableInputsByTx as jest.Mock).mockReturnValue(inputsMock);

    const unsignedTx = await createAvalancheUnsignedTx({
      tx: txMock,
      fromAddressBytes,
      vm,
      provider,
      credentials,
      utxos,
    });

    expect(unsignedTx).toBe(
      (UnsignedTx as unknown as jest.Mock).mock.instances[0]
    );
    expect(UnsignedTx as unknown as jest.Mock).toHaveBeenCalledWith(
      txMock,
      utxos,
      addressMapsMock,
      credentials
    );

    expect(handleSubnetAuth).not.toHaveBeenCalled();
    expect(utils.getTransferableInputsByTx).toHaveBeenCalledWith(txMock);
    expect(utils.AddressMaps.fromTransferableInputs).toHaveBeenCalledWith(
      inputsMock,
      utxos,
      BigInt(Math.floor(new Date().getTime() / 1000)),
      fromAddressBytes
    );
  });

  it('throws if it can not find outputs in the emitter tx', async () => {
    const inputsMock = [
      {
        utxoID: { txID: '0x1', outputIdx: { value: () => 1 } },
        assetId: 'assetId',
      },
    ];

    (utils.getTransferableInputsByTx as jest.Mock).mockReturnValue(inputsMock);

    const outputEmitterTxMock = { unsignedTx: { foo: 'bar' } };

    (getOutputEmitterTx as jest.Mock).mockResolvedValueOnce(
      outputEmitterTxMock
    );
    (utils.getTransferableOutputsByTx as jest.Mock).mockReturnValueOnce([]);

    await expect(
      createAvalancheUnsignedTx({
        tx: txMock,
        fromAddressBytes,
        vm,
        provider,
      })
    ).rejects.toThrowError('Unable to find UTXO "1"');

    expect(utils.getTransferableInputsByTx).toHaveBeenCalledWith(txMock);
    expect(getOutputEmitterTx).toHaveBeenCalledWith(
      txMock,
      provider,
      vm,
      '0x1'
    );
    expect(utils.getTransferableOutputsByTx).toHaveBeenCalledWith(
      outputEmitterTxMock.unsignedTx
    );
  });

  it('returns the correct UnsignedTx instance by fetching utxos', async () => {
    const inputsMock = [
      {
        utxoID: { txID: '0x1', outputIdx: { value: () => 0 } },
        assetId: 'assetId',
      },
      {
        utxoID: { txID: '0x2', outputIdx: { value: () => 1 } },
        assetId: 'assetId',
      },
    ];

    (utils.getTransferableInputsByTx as jest.Mock).mockReturnValue(inputsMock);

    const outputEmitterTxMock1 = {
      unsignedTx: { biz: 'baz' },
    };

    const outputEmitterTxMock2 = {
      unsignedTx: { baz: 'biz' },
    };

    (getOutputEmitterTx as jest.Mock)
      .mockResolvedValueOnce(outputEmitterTxMock1)
      .mockResolvedValueOnce(outputEmitterTxMock2);

    (utils.getTransferableOutputsByTx as jest.Mock)
      .mockImplementationOnce(() => {
        const transferableOutputInstance = Object.create(
          TransferableOutput.prototype
        );
        return [
          Object.assign(transferableOutputInstance, { output: { amount: 1 } }),
        ];
      })
      .mockImplementationOnce(() => {
        const transferableOutputInstance = Object.create(
          TransferableOutput.prototype
        );
        const rewardsOwnerOutputInstance = Object.create(
          OutputOwners.prototype
        );
        return [
          Object.assign(transferableOutputInstance, { output: { amount: 1 } }),
          Object.assign(rewardsOwnerOutputInstance, { amount: 3 }),
        ];
      });

    const unsignedTx = await createAvalancheUnsignedTx({
      tx: txMock,
      fromAddressBytes,
      vm,
      provider,
    });

    expect(unsignedTx).toBe(
      (UnsignedTx as unknown as jest.Mock).mock.instances[0]
    );
    expect(UnsignedTx as unknown as jest.Mock).toHaveBeenCalledWith(
      txMock,
      [
        (Utxo as unknown as jest.Mock).mock.instances[0],
        (Utxo as unknown as jest.Mock).mock.instances[1],
      ],
      addressMapsMock,
      undefined
    );

    expect(handleSubnetAuth).not.toHaveBeenCalled();
    expect(utils.getTransferableInputsByTx).toHaveBeenCalledWith(txMock);

    expect(getOutputEmitterTx).toHaveBeenCalledTimes(2);
    expect(getOutputEmitterTx).toHaveBeenNthCalledWith(
      1,
      txMock,
      provider,
      vm,
      '0x1'
    );
    expect(getOutputEmitterTx).toHaveBeenNthCalledWith(
      2,
      txMock,
      provider,
      vm,
      '0x2'
    );

    expect(utils.getTransferableOutputsByTx).toHaveBeenCalledTimes(2);
    expect(utils.getTransferableOutputsByTx).toHaveBeenNthCalledWith(
      1,
      outputEmitterTxMock1.unsignedTx
    );
    expect(utils.getTransferableOutputsByTx).toHaveBeenNthCalledWith(
      2,
      outputEmitterTxMock2.unsignedTx
    );

    expect(Utxo).toHaveBeenCalledTimes(2);
    expect(Utxo).toHaveBeenNthCalledWith(
      1,
      inputsMock[0]?.utxoID,
      inputsMock[0]?.assetId,
      { amount: 1 }
    );
    expect(Utxo).toHaveBeenNthCalledWith(
      2,
      inputsMock[1]?.utxoID,
      inputsMock[1]?.assetId,
      { amount: 3 }
    );

    expect(utils.AddressMaps.fromTransferableInputs).toHaveBeenCalledWith(
      inputsMock,
      [
        (Utxo as unknown as jest.Mock).mock.instances[0],
        (Utxo as unknown as jest.Mock).mock.instances[1],
      ],
      BigInt(Math.floor(new Date().getTime() / 1000)),
      fromAddressBytes
    );
  });

  describe('subnet transactions', () => {
    beforeEach(() => {
      (isSubnetTx as jest.Mock).mockReturnValueOnce(true);
    });

    it('throws if getting subnet auth data fails', async () => {
      const errorMessage = 'some error';
      (handleSubnetAuth as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const utxos = [{ assetId: 'assetId' }] as unknown as Utxo[];
      const inputsMock = [];
      (utils.getTransferableInputsByTx as jest.Mock).mockReturnValue(
        inputsMock
      );

      await expect(
        createAvalancheUnsignedTx({
          tx: txMock,
          fromAddressBytes,
          vm,
          provider,
          credentials,
          utxos,
        })
      ).rejects.toThrowError(
        `Error while preparing subnet authorization data: ${errorMessage}`
      );
    });

    it('returns the correct UnsignedTx instance with subnet auth address maps', async () => {
      const addressMapsMockWithSubnetAuth = { storage: [{ foo: 'bar' }] };
      (handleSubnetAuth as jest.Mock).mockResolvedValueOnce(
        addressMapsMockWithSubnetAuth
      );

      const utxos = [{ assetId: 'assetId' }] as unknown as Utxo[];
      const inputsMock = [];
      (utils.getTransferableInputsByTx as jest.Mock).mockReturnValue(
        inputsMock
      );

      const unsignedTx = await createAvalancheUnsignedTx({
        tx: txMock,
        fromAddressBytes,
        vm,
        provider,
        credentials,
        utxos,
      });

      expect(unsignedTx).toBe(
        (UnsignedTx as unknown as jest.Mock).mock.instances[0]
      );
      expect(UnsignedTx as unknown as jest.Mock).toHaveBeenCalledWith(
        txMock,
        utxos,
        addressMapsMockWithSubnetAuth,
        credentials
      );

      expect(handleSubnetAuth).toHaveBeenCalledWith({
        tx: txMock,
        provider,
        addressMaps: addressMapsMock,
      });
      expect(utils.getTransferableInputsByTx).toHaveBeenCalledWith(txMock);
      expect(utils.AddressMaps.fromTransferableInputs).toHaveBeenCalledWith(
        inputsMock,
        utxos,
        BigInt(Math.floor(new Date().getTime() / 1000)),
        fromAddressBytes
      );
    });
  });
});
