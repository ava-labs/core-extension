import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AnalyticsServicePosthog } from '../AnalyticsServicePosthog';
import { AnalyticsCapturedEvent } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
  string,
  [event: AnalyticsCapturedEvent]
>;

@injectable()
export class CaptureAnalyticsEventHandler implements HandlerType {
  method = ExtensionRequest.ANALYTICS_CAPTURE_EVENT as const;

  constructor(private analyticsServicePosthog: AnalyticsServicePosthog) {}

  handle: HandlerType['handle'] = async (request) => {
    if (request) {
      this.analyticsServicePosthog.captureEvent(request.params[0]);
    }
    try {
      return {
        ...request,
        result: 'success',
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
