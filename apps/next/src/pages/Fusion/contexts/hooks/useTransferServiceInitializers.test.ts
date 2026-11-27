import { renderHook } from '@testing-library/react';
import { ServiceType } from '@avalabs/fusion-sdk';

import { useNetworkContext } from '@core/ui';

import { useAvalancheFunctions } from './useAvalancheFunctions';
import { useTransferServiceInitializers } from './useTransferServiceInitializers';

jest.mock('@core/ui', () => ({
  useConnectionContext: () => ({ request: jest.fn() }),
  useNetworkContext: jest.fn(),
}));
jest.mock('@core/common', () => ({
  getServiceInitializer: (
    type: ServiceType,
    btcFunctions: unknown,
    signers: { evm: unknown; btc: unknown },
    avalancheFunctions: object,
  ) =>
    type === ServiceType.AVALANCHE_CCT
      ? { type, ...avalancheFunctions }
      : {
          type,
          evmSigner: signers.evm,
          btcSigner: signers.btc,
          btcFunctions,
        },
}));
jest.mock('./useAvalancheFunctions');

const buildAvalancheFunctions = (address: string) => ({
  avalancheSendTx: jest.fn().mockResolvedValue(address),
  getAtomicUtxos: jest.fn(),
  getCoreEthAddress: jest.fn().mockReturnValue(address),
  getUtxos: jest.fn(),
  getWalletAddressesForChainAlias: jest.fn(),
  getWalletChangeAddressForChainAlias: jest.fn(),
});

const buildSigners = (account: string) =>
  ({
    evm: { sign: jest.fn().mockResolvedValue(account) },
    btc: { sign: jest.fn().mockResolvedValue(account) },
    svm: { sign: jest.fn().mockResolvedValue(account) },
  }) as never;

const buildBitcoinProvider = (account: string) => ({
  getUTXOs: jest.fn().mockResolvedValue(account),
});

describe('useTransferServiceInitializers', () => {
  const services = [ServiceType.AVALANCHE_CCT, ServiceType.AVALANCHE_EVM];

  beforeEach(() => {
    jest
      .mocked(useNetworkContext)
      .mockReturnValue({ bitcoinProvider: buildBitcoinProvider('a') } as never);
    jest
      .mocked(useAvalancheFunctions)
      .mockReturnValue(buildAvalancheFunctions('account-a') as never);
  });

  it('keeps initializers stable and routes calls to the latest account after a switch', async () => {
    const signersA = buildSigners('account-a');
    const { result, rerender } = renderHook(
      ({ signers }) => useTransferServiceInitializers(services, signers),
      { initialProps: { signers: signersA } },
    );

    const [cct, evm] = result.current.serviceInitializers as unknown as [
      ReturnType<typeof buildAvalancheFunctions> & { type: string },
      {
        evmSigner: { sign: () => Promise<string> };
        btcFunctions: { getUTXOs: () => Promise<string> };
      },
    ];
    const spreadCct = { ...cct };

    const signersB = buildSigners('account-b');
    const functionsB = buildAvalancheFunctions('account-b');
    jest.mocked(useAvalancheFunctions).mockReturnValue(functionsB as never);
    jest
      .mocked(useNetworkContext)
      .mockReturnValue({ bitcoinProvider: buildBitcoinProvider('b') } as never);
    rerender({ signers: signersB });

    expect(result.current.serviceInitializers[0]).toBe(cct);

    expect(spreadCct.getCoreEthAddress('0x')).toBe('account-b');
    expect(functionsB.getCoreEthAddress).toHaveBeenCalledTimes(1);
    expect(await spreadCct.avalancheSendTx({} as never, {} as never)).toBe(
      'account-b',
    );
    expect(await evm.evmSigner.sign()).toBe('account-b');
    expect(await evm.btcFunctions.getUTXOs()).toBe('b');
  });

  it('returns no initializers without signers', () => {
    const { result } = renderHook(() =>
      useTransferServiceInitializers(services, null),
    );

    expect(result.current.serviceInitializers).toEqual([]);
  });

  it('rebuilds initializers when a signer loses an optional method', async () => {
    const withBatch = buildSigners('account-a') as unknown as {
      evm: Record<string, unknown>;
    };
    withBatch.evm.signBatch = jest.fn().mockResolvedValue('batch');

    const { result, rerender } = renderHook(
      ({ signers }) => useTransferServiceInitializers(services, signers),
      { initialProps: { signers: withBatch as never } },
    );

    const first = result.current;
    const [, firstEvm] = first.serviceInitializers as unknown as [
      unknown,
      { evmSigner: Record<string, unknown> },
    ];
    expect(typeof firstEvm.evmSigner.signBatch).toBe('function');

    rerender({ signers: buildSigners('account-b') });

    const [, nextEvm] = result.current.serviceInitializers as unknown as [
      unknown,
      { evmSigner: Record<string, unknown> },
    ];
    expect(result.current.capabilitySignature).not.toBe(
      first.capabilitySignature,
    );
    expect(result.current.serviceInitializers).not.toBe(
      first.serviceInitializers,
    );
    expect('signBatch' in nextEvm.evmSigner).toBe(false);
  });

  it('keeps initializers and signature when capabilities are unchanged', () => {
    const { result, rerender } = renderHook(
      ({ signers }) => useTransferServiceInitializers(services, signers),
      { initialProps: { signers: buildSigners('account-a') } },
    );
    const first = result.current;

    rerender({ signers: buildSigners('account-b') });

    expect(result.current.capabilitySignature).toBe(first.capabilitySignature);
    expect(result.current.serviceInitializers).toBe(first.serviceInitializers);
  });
});
