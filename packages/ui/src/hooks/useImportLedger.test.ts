import {
  ExtensionRequest,
  ImportLedgerWalletParams,
  LegacyImportLedgerWalletParams,
} from '@core/types';
import { act, renderHook } from '@testing-library/react';
import { useConnectionContext } from '../contexts';
import { useImportLedger } from './useImportLedger';

jest.mock('../contexts', () => ({
  useConnectionContext: jest.fn(),
}));

describe('hooks/useImportLedger', () => {
  const request = jest.fn();
  const importResult = { type: 'ledger', name: 'Ledger', id: 'wallet-id' };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(useConnectionContext).mockReturnValue({ request } as any);
  });

  it('uses the legacy import for xpub-based params', async () => {
    request.mockResolvedValue(importResult);
    const params = { xpub: 'xpub' } as LegacyImportLedgerWalletParams;

    const { result } = renderHook(() => useImportLedger());

    await act(async () => {
      await expect(result.current.importLedger(params)).resolves.toBe(
        importResult,
      );
    });
    expect(request).toHaveBeenCalledWith({
      method: ExtensionRequest.WALLET_IMPORT_LEDGER,
      params: [params],
    });
    expect(result.current.isImporting).toBe(false);
  });

  it('uses the new import for address-public-key params', async () => {
    request.mockResolvedValue(importResult);
    const params = {
      addressPublicKeys: [],
    } as unknown as ImportLedgerWalletParams;

    const { result } = renderHook(() => useImportLedger());

    await act(async () => {
      await expect(result.current.importLedger(params)).resolves.toBe(
        importResult,
      );
    });
    expect(request).toHaveBeenCalledWith({
      method: ExtensionRequest.WALLET_IMPORT_LEDGER_NEW,
      params: [params],
    });
  });

  it('reports the import in progress until the request settles', async () => {
    let resolveRequest!: (value: unknown) => void;
    request.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { result } = renderHook(() => useImportLedger());

    let pending!: Promise<unknown>;
    act(() => {
      pending = result.current.importLedger({
        addressPublicKeys: [],
      } as unknown as ImportLedgerWalletParams);
    });
    expect(result.current.isImporting).toBe(true);

    await act(async () => {
      resolveRequest(importResult);
      await pending;
    });
    expect(result.current.isImporting).toBe(false);
  });

  it('resets the importing state when the import fails', async () => {
    request.mockRejectedValue(new Error('import failed'));

    const { result } = renderHook(() => useImportLedger());

    await act(async () => {
      await expect(
        result.current.importLedger({
          xpub: 'xpub',
        } as LegacyImportLedgerWalletParams),
      ).rejects.toThrow('import failed');
    });
    expect(result.current.isImporting).toBe(false);
  });
});
