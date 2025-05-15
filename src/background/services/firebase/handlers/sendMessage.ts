import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { FirebaseService } from '../FirebaseService';
import { Content, FunctionCall } from 'firebase/vertexai';
import { ChatDialogHistory } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.FIREBASE_SEND_MESSAGE,
  {
    text: string;
    functionCalls?: FunctionCall[];
  },
  {
    message: string;
    parts: Content[] | undefined;
    history: ChatDialogHistory[] | undefined;
  }
>;

@injectable()
export class FirebaseSendMessageHandler implements HandlerType {
  method = ExtensionRequest.FIREBASE_SEND_MESSAGE as const;

  constructor(private firebaseService: FirebaseService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { message, parts, history } = request.params;
    console.log('history: ', history);
    if (!message) {
      return {
        ...request,
        error: 'no message',
      };
    }
    try {
      const response = await this.firebaseService.generateContent({
        message,
        parts,
        history,
      });

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
