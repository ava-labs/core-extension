import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { FirebaseService } from '../FirebaseService';
import { EnhancedGenerateContentResponse } from 'firebase/vertexai';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.FIREBASE_SEND_MESSAGE,
  EnhancedGenerateContentResponse,
  string
>;

@injectable()
export class FirebaseSendMessageHandler implements HandlerType {
  method = ExtensionRequest.FIREBASE_SEND_MESSAGE as const;

  constructor(private firebaseService: FirebaseService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const message = request.params;
    if (!message) {
      return {
        ...request,
        error: 'no message',
      };
    }
    try {
      const response = await this.firebaseService.sendModelMessage(message);
      console.log('FirebaseSendMessageHandler response: ', response);

      return {
        ...request,
        result: response,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e,
      };
    }
  };
}
