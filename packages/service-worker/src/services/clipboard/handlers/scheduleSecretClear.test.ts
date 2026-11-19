import { ExtensionRequest } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { ClipboardService } from '../ClipboardService';
import { ScheduleClipboardSecretClearHandler } from './scheduleSecretClear';

describe('ScheduleClipboardSecretClearHandler', () => {
  const clipboardService = {
    scheduleSecretClear: jest.fn(),
  } as unknown as jest.Mocked<ClipboardService>;

  const handler = new ScheduleClipboardSecretClearHandler(clipboardService);

  const request = (params: [string]) =>
    buildRpcCall({
      id: '123',
      method: ExtensionRequest.CLIPBOARD_SCHEDULE_SECRET_CLEAR,
      params,
    });

  it('schedules the clear for the given hash', async () => {
    const hash = 'cd'.repeat(32);

    const result = await handler.handle(request([hash]));

    expect(clipboardService.scheduleSecretClear).toHaveBeenCalledWith(hash);
    expect(result).toEqual(expect.objectContaining({ result: true }));
  });

  it('returns an error when scheduling fails', async () => {
    clipboardService.scheduleSecretClear.mockRejectedValueOnce(
      new Error('Invalid clipboard secret hash'),
    );

    const result = await handler.handle(request(['nope']));

    expect(result).toEqual(
      expect.objectContaining({ error: 'Invalid clipboard secret hash' }),
    );
  });
});
