import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { FirebaseService } from '../FirebaseService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.FIREBASE_START_CHAT,
  boolean,
  {
    tools: any;
    toolConfig: any;
    systemInstruction: any;
    history: any[];
  }
>;

@injectable()
export class FirebaseStartChatHandler implements HandlerType {
  method = ExtensionRequest.FIREBASE_START_CHAT as const;

  constructor(private firebaseService: FirebaseService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { tools, toolConfig, systemInstruction, history } = request.params;
    const chat = await this.firebaseService.startChat({
      tools,
      toolConfig,
      systemInstruction,
      history,
    });

    return {
      ...request,
      result: chat,
    };
  };
}
