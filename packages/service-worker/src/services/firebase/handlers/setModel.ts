import {
  ConfigParams,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { FirebaseService } from '../FirebaseService';

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
    const { tools, systemInstruction } = request.params;
    const chat = await this.firebaseService.setModel({
      tools,

      systemInstruction,
    });

    return {
      ...request,
      result: chat,
    };
  };
}
