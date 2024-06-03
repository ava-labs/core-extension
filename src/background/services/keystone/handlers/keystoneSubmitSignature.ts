import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { KeystoneService } from '../KeystoneService';
import { DeviceResponseData } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.KEYSTONE_SUBMIT_SIGNATURE,
  boolean,
  [response: DeviceResponseData]
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
