import {
  EVM,
  EVMUnsignedTx,
  evmSerial,
  utils,
  UnsignedTx,
  Utxo,
  TransferableOutput,
  OutputOwners,
} from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';
import createAvalancheEvmUnsignedTx from './createAvalancheEvmUnsignedTx';
import getApiBySourceTx from './getApiBySourceTx';

jest.mock('@avalabs/avalanchejs-v2');
jest.mock('./getApiBySourceTx');

describe('src/background/services/wallet/utils/createAvalancheEvmUnsignedTx', () => {
  const txBytes = new Uint8Array([0, 1, 2]);
  const fromAddress = 'C-fuji123';
  const fromAddressBytes = new Uint8Array([4, 5, 6]);
  const fromAddressHex = '0x123';
  const vm = EVM;
  const provider = { foo: 'bar' } as unknown as Avalanche.JsonRpcProvider;

  const apiMock = {
    getTx: jest.fn(),
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2008, 10, 31));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.resetAllMocks();

    (getApiBySourceTx as jest.Mock).mockReturnValue(apiMock);
    (utils.parse as jest.Mock).mockReturnValue([
      undefined,
      undefined,
      fromAddressBytes,
    ]);
    (utils.bufferToHex as jest.Mock).mockReturnValue(fromAddressHex);
  });

  it('throws an error for unsuported tx types', async () => {
    const txMock = {};
    (utils.unpackWithManager as jest.Mock).mockReturnValueOnce(txMock);

    await expect(
      createAvalancheEvmUnsignedTx({ txBytes, fromAddress, vm, provider })
    ).rejects.toThrowError('Unsupported transaction type');
  });

  it('returns an EVMUnsignedTx instance for an export tx correctly', async () => {
    const txMock = {};
    const addressMapsMock = { storage: {} };
    (utils.unpackWithManager as jest.Mock).mockReturnValueOnce(txMock);
    (evmSerial.isExportTx as unknown as jest.Mock).mockReturnValueOnce(true);
    (utils.AddressMaps as unknown as jest.Mock).mockReturnValueOnce(
      addressMapsMock
    );

    const evmUnsignedTx = await createAvalancheEvmUnsignedTx({
      txBytes,
      fromAddress,
      vm,
      provider,
    });

    expect(evmUnsignedTx).toBe(
      (EVMUnsignedTx as unknown as jest.Mock).mock.instances[0]
    );
    expect(EVMUnsignedTx as unknown as jest.Mock).toHaveBeenCalledWith(
      txMock,
      [],
      addressMapsMock
    );
    expect(utils.unpackWithManager).toHaveBeenCalledWith(vm, txBytes);
    expect(getApiBySourceTx).toHaveBeenCalledWith(txMock, provider, vm);
    expect(utils.parse).toHaveBeenCalledWith(fromAddress);
    expect(utils.bufferToHex).toHaveBeenCalledWith(fromAddressBytes);
  });

  it('throws if it can not find outputs for an import tx', async () => {
    const txMock = {
      importedInputs: [
        {
          utxoID: { txID: '0x1', outputIdx: { value: () => 1 } },
          assetId: 'assetId',
        },
      ],
    };

    const outputEmitterTxMock = {
      unsignedTx: { biz: 'baz' },
    };

    apiMock.getTx.mockResolvedValueOnce(outputEmitterTxMock);
    (utils.unpackWithManager as jest.Mock).mockReturnValueOnce(txMock);
    (evmSerial.isImportTx as unknown as jest.Mock).mockReturnValueOnce(true);
    (utils.getTransferableOutputsByTx as jest.Mock).mockReturnValueOnce([]);

    await expect(
      createAvalancheEvmUnsignedTx({
        txBytes,
        fromAddress,
        vm,
        provider,
      })
    ).rejects.toThrowError('Unable to find UTXO "1"');

    expect(utils.unpackWithManager).toHaveBeenCalledWith(vm, txBytes);
    expect(getApiBySourceTx).toHaveBeenCalledWith(txMock, provider, vm);
    expect(utils.parse).toHaveBeenCalledWith(fromAddress);
    expect(utils.bufferToHex).toHaveBeenCalledWith(fromAddressBytes);
    expect(apiMock.getTx).toHaveBeenCalledWith({
      txID: '0x1',
    });
    expect(utils.getTransferableOutputsByTx).toHaveBeenCalledWith(
      outputEmitterTxMock.unsignedTx
    );
  });

  it('returns an UnsignedTx instance for an import tx correctly', async () => {
    const addressMapsMock = { storage: {} };
    const txMock = {
      importedInputs: [
        {
          utxoID: { txID: '0x1', outputIdx: { value: () => 0 } },
          assetId: 'assetId',
        },
        {
          utxoID: { txID: '0x2', outputIdx: { value: () => 1 } },
          assetId: 'assetId',
        },
      ],
    };

    const outputEmitterTxMock1 = {
      unsignedTx: { biz: 'baz' },
    };

    const outputEmitterTxMock2 = {
      unsignedTx: { baz: 'biz' },
    };

    (utils.AddressMaps.fromTransferableInputs as jest.Mock).mockReturnValueOnce(
      addressMapsMock
    );
    apiMock.getTx
      .mockResolvedValueOnce(outputEmitterTxMock1)
      .mockResolvedValueOnce(outputEmitterTxMock2);
    (utils.unpackWithManager as jest.Mock).mockReturnValueOnce(txMock);
    (evmSerial.isImportTx as unknown as jest.Mock).mockReturnValue(true);
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

    const unsignedTx = await createAvalancheEvmUnsignedTx({
      txBytes,
      fromAddress,
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
      addressMapsMock
    );

    expect(utils.unpackWithManager).toHaveBeenCalledWith(vm, txBytes);
    expect(getApiBySourceTx).toHaveBeenCalledWith(txMock, provider, vm);
    expect(utils.parse).toHaveBeenCalledWith(fromAddress);
    expect(utils.bufferToHex).toHaveBeenCalledWith(fromAddressBytes);

    expect(apiMock.getTx).toHaveBeenCalledTimes(2);
    expect(apiMock.getTx).toHaveBeenNthCalledWith(1, {
      txID: '0x1',
    });
    expect(apiMock.getTx).toHaveBeenNthCalledWith(2, {
      txID: '0x2',
    });

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
      txMock.importedInputs[0]?.utxoID,
      txMock.importedInputs[0]?.assetId,
      { amount: 1 }
    );
    expect(Utxo).toHaveBeenNthCalledWith(
      2,
      txMock.importedInputs[1]?.utxoID,
      txMock.importedInputs[1]?.assetId,
      { amount: 3 }
    );

    expect(utils.AddressMaps.fromTransferableInputs).toHaveBeenCalledWith(
      txMock.importedInputs,
      [
        (Utxo as unknown as jest.Mock).mock.instances[0],
        (Utxo as unknown as jest.Mock).mock.instances[1],
      ],
      BigInt(Math.floor(new Date().getTime() / 1000)),
      [fromAddressBytes]
    );
  });
});
