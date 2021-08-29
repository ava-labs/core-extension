import { PostMessageEvent } from '@metamask/post-message-stream';
import { filter, fromEventPattern, map } from 'rxjs';

export interface PostMessageData<T = any> {
  data: T;
  target: string;
}

export function windowPostMessage(config: {
  scope: string;
  target: string;
  targetWindow?: Window;
}) {
  const targetOrigin = config.targetWindow ? '*' : location.origin;
  const targetWindow = config.targetWindow || globalThis;
  (targetWindow as any).testingThis = true;

  const listen = fromEventPattern<PostMessageEvent>(
    (handler) => globalThis.addEventListener('message', handler),
    (handler) => globalThis.removeEventListener('message', handler)
  ).pipe(
    filter((evt) => {
      return !!(
        evt.origin === targetOrigin && (evt.data as any).target === config.scope
      );
    }),
    map((evt) => evt.data as unknown as PostMessageData)
  );

  function dispatch(data) {
    targetWindow.postMessage({ data, target: config.target }, targetOrigin);
  }

  return { listen, dispatch };
}
