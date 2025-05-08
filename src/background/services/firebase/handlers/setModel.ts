import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { FirebaseService } from '../FirebaseService';
import { ConfigParams } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.FIREBASE_SET_MODEL,
  boolean,
  ConfigParams
>;

@injectable()
export class FirebaseSetModelHandler implements HandlerType {
  method = ExtensionRequest.FIREBASE_SET_MODEL as const;

  constructor(private firebaseService: FirebaseService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { tools, toolConfig, systemInstruction } = request.params;
    const chat = await this.firebaseService.setModel({
      tools,
      toolConfig,
      systemInstruction,
    });

    return {
      ...request,
      result: chat,
    };
  };
}
