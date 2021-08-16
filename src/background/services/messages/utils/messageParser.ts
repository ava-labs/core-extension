import { Message } from '../models';

function mergeParseMessage(
  message: Message,
  result: { data: string } | { params: any }
) {
  return {
    ...message,
    ...result,
  };
}

export function messageParser(
  message
): (Message & { params?: any; data?: any }) | undefined {
  if (
    message &&
    (message.type === 'eth_sign' ||
      message.type === 'signTypedData' ||
      message.type === 'signTypedData_v1')
  ) {
    return mergeParseMessage(message, { data: message.msgParams.data });
  } else if (message?.type === 'personal_sign') {
    return mergeParseMessage(message, { params: message.msgParams.data });
  } else if (
    message?.type === 'signTypedData_v3' ||
    message?.type === 'signTypedData_v4'
  ) {
    return mergeParseMessage(message, {
      data: JSON.parse(message.msgParams.data),
    });
  }
}
