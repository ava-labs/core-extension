import { ClipboardClearResult } from '@core/types';
import { clearClipboardIfMatches } from './clearClipboardIfMatches';
import { sha256Hex } from './sha256Hex';

const SECRET = 'test test test test test test test test test test test junk';

describe('clearClipboardIfMatches', () => {
  const hash = sha256Hex(SECRET);

  it('clears the clipboard when it still holds the secret', async () => {
    const write = jest.fn().mockReturnValue(true);

    const result = await clearClipboardIfMatches(hash, {
      read: () => SECRET,
      write,
    });

    expect(result).toBe(ClipboardClearResult.Cleared);
    expect(write).toHaveBeenCalledWith('');
  });

  it('leaves the clipboard alone when the content changed', async () => {
    const write = jest.fn().mockReturnValue(true);

    const result = await clearClipboardIfMatches(hash, {
      read: async () => 'something else the user copied',
      write,
    });

    expect(result).toBe(ClipboardClearResult.Changed);
    expect(write).not.toHaveBeenCalled();
  });

  it('clears unverified when the clipboard cannot be read', async () => {
    const write = jest.fn().mockResolvedValue(true);

    await expect(
      clearClipboardIfMatches(hash, { read: () => null, write }),
    ).resolves.toBe(ClipboardClearResult.ClearedUnverified);
    expect(write).toHaveBeenCalledWith('');
  });

  it('treats a throwing reader as unreadable', async () => {
    const write = jest.fn().mockReturnValue(true);

    await expect(
      clearClipboardIfMatches(hash, {
        read: () => {
          throw new Error('denied');
        },
        write,
      }),
    ).resolves.toBe(ClipboardClearResult.ClearedUnverified);
  });

  it('reports failure when writing fails', async () => {
    await expect(
      clearClipboardIfMatches(hash, {
        read: () => SECRET,
        write: () => {
          throw new Error('not focused');
        },
      }),
    ).resolves.toBe(ClipboardClearResult.Failed);

    await expect(
      clearClipboardIfMatches(hash, { read: () => SECRET, write: () => false }),
    ).resolves.toBe(ClipboardClearResult.Failed);
  });
});
