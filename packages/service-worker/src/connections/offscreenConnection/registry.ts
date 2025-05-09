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
])
export class OffscreenEventEmitterRegistry {}
