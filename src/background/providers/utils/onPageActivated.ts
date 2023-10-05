/**
 * Pre-rendering causes some issues with the way the extension
 * communicates with dApps. Namely, when the page is first pre-rendered,
 * content scripts are injected before the page is activated
 * by the user. Then when the user finally activates it, the connection
 * gets lost.
 *
 * This util is useful for only running certain actions after the page
 * has been activated by the user. This ensures that the connection
 * remains active.
 *
 * References:
 * https://developer.chrome.com/blog/prerender-pages/
 * https://developer.chrome.com/blog/extension-instantnav/#lifecyle
 */
export default function onPageActivated(callback) {
  // eslint-disable-next-line
  // @ts-ignore
  if (document.prerendering) {
    document.addEventListener('prerenderingchange', callback, { once: true });
  } else {
    callback();
  }
}
