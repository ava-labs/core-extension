import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { ClipboardService } from '../ClipboardService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.CLIPBOARD_SCHEDULE_SECRET_CLEAR,
  true,
  [hash: string]
>;

@injectable()
export class ScheduleClipboardSecretClearHandler implements HandlerType {
  method = ExtensionRequest.CLIPBOARD_SCHEDULE_SECRET_CLEAR as const;

  constructor(private clipboardService: ClipboardService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [hash] = request.params ?? [];

    try {
      await this.clipboardService.scheduleSecretClear(hash);
    } catch (err) {
      return {
        ...request,
        error: (err as Error).message,
      };
    }

    return {
      ...request,
      result: true,
    };
  };
}
