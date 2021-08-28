import { PostMessageEvent } from '@metamask/post-message-stream';
import { filter, fromEventPattern, map } from 'rxjs';

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
    map((evt) => evt.data)
  );

  function dispatch(message) {
    targetWindow.postMessage(message, targetOrigin);
  }

  return { listen, dispatch };
}
