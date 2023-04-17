import {
  avaxSerial,
  AVM,
  avmSerial,
  evmSerial,
  pvmSerial,
} from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';
import getApiBySourceTx from './getApiBySourceTx';

jest.mock('@avalabs/avalanchejs-v2');

describe('src/background/services/wallet/utils/getApiBySourceTx', () => {
  const getTxMock = (sourceChain?: string) =>
    ({
      sourceChain,
    } as unknown as avaxSerial.AvaxTx);

  const providerMock = {
    getApiByChainID: jest.fn(),
    getApiByVM: jest.fn(),
  } as unknown as Avalanche.JsonRpcProvider;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns the correct API for AVM import transactions', () => {
    (avmSerial.isImportTx as unknown as jest.Mock).mockReturnValueOnce(true);

    const sourceChain = 'P';
    const tx = getTxMock(sourceChain);
    getApiBySourceTx(tx, providerMock, AVM);

    expect(providerMock.getApiByChainID).toBeCalledWith(sourceChain);
  });

  it('returns the correct API for PVM import transactions', () => {
    (pvmSerial.isImportTx as unknown as jest.Mock).mockReturnValueOnce(true);

    const sourceChain = 'X';
    const tx = getTxMock(sourceChain);
    getApiBySourceTx(tx, providerMock, AVM);

    expect(providerMock.getApiByChainID).toBeCalledWith(sourceChain);
  });

  it('returns the correct API for EVM import transactions', () => {
    (evmSerial.isImportTx as unknown as jest.Mock).mockReturnValueOnce(true);

    const sourceChain = 'X';
    const tx = getTxMock(sourceChain);
    getApiBySourceTx(tx, providerMock, AVM);

    expect(providerMock.getApiByChainID).toBeCalledWith(sourceChain);
  });

  it('returns the correct API for non-import transactions', () => {
    const tx = getTxMock();
    getApiBySourceTx(tx, providerMock, AVM);

    expect(providerMock.getApiByVM).toBeCalledWith(AVM);
  });
});
