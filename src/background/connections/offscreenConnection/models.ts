import { ExtensionRequest } from '../extensionConnection/models';
import { GaslessEvents } from '@src/background/services/gasless/model';

export enum OffscreenRequest {
  SEND_MESSAGE = GaslessEvents.SEND_MESSAGE,
  GASLESS_FUND_TX = ExtensionRequest.GASLESS_FUND_TX,
  GASLESS_GET_CHALLENGE = ExtensionRequest.GASLESS_GET_CHALLENGE,
  GASLESS_SOLVE_CHALLENGE = ExtensionRequest.GASLESS_SOLVE_CHALLENGE,
}
