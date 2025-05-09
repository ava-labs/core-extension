import {
  ExtensionRequest,
  ExtensionRequestHandler,
  KeystoneDeviceResponseData,
} from '@core/types';
import { injectable } from 'tsyringe';
import { KeystoneService } from '../KeystoneService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.KEYSTONE_SUBMIT_SIGNATURE,
  boolean,
  [response: KeystoneDeviceResponseData]
>;

@injectable()
export class SubmitKeystoneSignature implements HandlerType {
  method = ExtensionRequest.KEYSTONE_SUBMIT_SIGNATURE as const;

  constructor(private keystoneService: KeystoneService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [response] = request.params;

    this.keystoneService.submitSignatureResponse(response);

    return {
      ...request,
      result: true,
    };
  };
}
