import { avaxSerial, AVM, avmSerial, pvmSerial } from '@avalabs/avalanchejs-v2';
import getApiBySourceTx from './getApiBySourceTx';
import getOutputEmitterTx from './getOutputEmitterTx';

jest.mock('./getApiBySourceTx');
jest.mock('@avalabs/avalanchejs-v2');

describe('src/background/services/wallet/utils/getOutputEmitterTx', () => {
  const cBlockchainID = 'cBlockchainID';
  const outputEmitterTxId = '0x1';
  const sourceTxMock = { id: outputEmitterTxId };
  const apiMock = {
    getAtomicTx: jest.fn(),
    getTx: jest.fn(),
  };
  const providerMock = {
    getContext: jest.fn(),
  } as any;

  const getTxMock = (sourceChain?: string) =>
    ({
      sourceChain,
    } as unknown as avaxSerial.AvaxTx);

  beforeEach(() => {
    jest.resetAllMocks();
    (getApiBySourceTx as jest.Mock).mockReturnValue(apiMock);
  });

  it('throws if getAtomicTx request fails', async () => {
    apiMock.getAtomicTx.mockRejectedValueOnce(new Error('some error'));
    providerMock.getContext.mockReturnValueOnce({ cBlockchainID });
    (avmSerial.isImportTx as unknown as jest.Mock).mockReturnValueOnce(true);

    const tx = getTxMock(cBlockchainID);
    await expect(
      getOutputEmitterTx(tx, providerMock, AVM, outputEmitterTxId)
    ).rejects.toThrowError(
      'Error while fetching source transaction: "some error"'
    );
  });

  it('throws if getTx request fails', async () => {
    apiMock.getTx.mockRejectedValueOnce(new Error('some error'));
    providerMock.getContext.mockReturnValueOnce({ cBlockchainID });

    const tx = getTxMock(cBlockchainID);

    await expect(
      getOutputEmitterTx(tx, providerMock, AVM, outputEmitterTxId)
    ).rejects.toThrowError(
      'Error while fetching source transaction: "some error"'
    );
  });

  it('returns the correct source tx while importing from C to X', async () => {
    apiMock.getAtomicTx.mockResolvedValueOnce(sourceTxMock);
    providerMock.getContext.mockReturnValueOnce({ cBlockchainID });
    (avmSerial.isImportTx as unknown as jest.Mock).mockReturnValueOnce(true);

    const tx = getTxMock(cBlockchainID);

    await expect(
      getOutputEmitterTx(tx, providerMock, AVM, outputEmitterTxId)
    ).resolves.toStrictEqual(sourceTxMock);
  });

  it('returns the correct source tx while importing from C to P', async () => {
    apiMock.getAtomicTx.mockResolvedValueOnce(sourceTxMock);
    providerMock.getContext.mockReturnValueOnce({ cBlockchainID });
    (pvmSerial.isImportTx as unknown as jest.Mock).mockReturnValueOnce(true);

    const tx = getTxMock(cBlockchainID);

    await expect(
      getOutputEmitterTx(tx, providerMock, AVM, outputEmitterTxId)
    ).resolves.toStrictEqual(sourceTxMock);
  });

  it('returns the correct source tx while not importing from C', async () => {
    apiMock.getTx.mockResolvedValueOnce(sourceTxMock);
    providerMock.getContext.mockReturnValueOnce({ cBlockchainID });

    const tx = getTxMock(cBlockchainID);

    await expect(
      getOutputEmitterTx(tx, providerMock, AVM, outputEmitterTxId)
    ).resolves.toStrictEqual(sourceTxMock);
  });
});
