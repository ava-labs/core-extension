import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { FirebaseService } from '../FirebaseService';
import { Content, FunctionCall } from 'firebase/vertexai';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.FIREBASE_SEND_MESSAGE,
  { text: string; functionCalls?: FunctionCall[] },
  [string, Content[] | undefined]
>;

@injectable()
export class FirebaseSendMessageHandler implements HandlerType {
  method = ExtensionRequest.FIREBASE_SEND_MESSAGE as const;

  constructor(private firebaseService: FirebaseService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [message, parts] = request.params;
    if (!message) {
      return {
        ...request,
        error: 'no message',
      };
    }
    try {
      const response = await this.firebaseService.generateContent(
        message,
        parts,
      );

      return {
        ...request,
        result: {
          text: response.text(),
          functionCalls: response.functionCalls(),
        },
      };
    } catch (e: any) {
      return {
        ...request,
        error: e,
      };
    }
  };
}
