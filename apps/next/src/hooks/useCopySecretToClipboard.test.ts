import { act, renderHook } from '@testing-library/react';
import { ExtensionRequest } from '@core/types';
import { toast, useConnectionContext } from '@core/ui';
import { copySecretToClipboard } from '@/lib/copySecretToClipboard';
import { useCopySecretToClipboard } from './useCopySecretToClipboard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@core/ui', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  useConnectionContext: jest.fn(),
}));

jest.mock('@/lib/copySecretToClipboard', () => ({
  copySecretToClipboard: jest.fn(),
}));

describe('useCopySecretToClipboard', () => {
  const request = jest.fn();

  beforeEach(() => {
    jest.mocked(useConnectionContext).mockReturnValue({
      request,
    } as unknown as ReturnType<typeof useConnectionContext>);
  });

  it.each([
    ['recoveryPhrase', 'Never share your recovery phrase with anyone.'],
    ['privateKey', 'Never share your private key with anyone.'],
  ] as const)(
    'shows the clipboard warning for a %s',
    async (secretType, description) => {
      jest
        .mocked(copySecretToClipboard)
        .mockImplementation(async (_secret, { notify }) => notify());
      const { result } = renderHook(() => useCopySecretToClipboard());

      await act(() => result.current('secret', secretType));

      expect(toast.success).toHaveBeenCalledWith(
        'Copied. Clipboard will be cleared in 60 seconds.',
        expect.objectContaining({ description }),
      );
    },
  );

  it('schedules the background clear through the service worker', async () => {
    jest
      .mocked(copySecretToClipboard)
      .mockImplementation(async (_secret, { scheduleBackgroundClear }) => {
        await scheduleBackgroundClear('a'.repeat(64));
      });
    const { result } = renderHook(() => useCopySecretToClipboard());

    await act(() => result.current('secret', 'recoveryPhrase'));

    expect(copySecretToClipboard).toHaveBeenCalledWith(
      'secret',
      expect.any(Object),
    );
    expect(request).toHaveBeenCalledWith({
      method: ExtensionRequest.CLIPBOARD_SCHEDULE_SECRET_CLEAR,
      params: ['a'.repeat(64)],
    });
  });

  it('shows an error when copying fails', async () => {
    jest.mocked(copySecretToClipboard).mockRejectedValue(new Error('denied'));
    const { result } = renderHook(() => useCopySecretToClipboard());

    let copied: boolean | undefined;
    await act(async () => {
      copied = await result.current('secret', 'privateKey');
    });

    expect(copied).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Failed to copy to clipboard');
    expect(toast.success).not.toHaveBeenCalled();
  });
});
