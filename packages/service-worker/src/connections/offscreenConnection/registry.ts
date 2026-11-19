import { ClipboardService } from '../../services/clipboard/ClipboardService';
import { GaslessSendOffscreenMessageEvent } from '../../services/gasless/events/gaslessSendMessageEvent';
import { SetGaslessHexValues } from '../../services/gasless/handlers/setHexValues';
import { registry } from 'tsyringe';

@registry([
  {
    token: 'OffscreenRequestHandler',
    useToken: SetGaslessHexValues,
  },
])
export class OffscreenRequestHandlerRegistry {}

@registry([
  {
    token: 'OffscreenEventEmitter',
    useToken: GaslessSendOffscreenMessageEvent,
  },
  {
    token: 'OffscreenEventEmitter',
    useToken: ClipboardService,
  },
])
export class OffscreenEventEmitterRegistry {}
