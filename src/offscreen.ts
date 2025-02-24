import browser, { Runtime } from 'webextension-polyfill';
import { OFFSCREEN_SCRIPT } from './common';

console.log('offsreen starting....');
const connection: Runtime.Port = browser.runtime.connect({
  name: OFFSCREEN_SCRIPT,
});
console.log('newConnection2: ', connection);

connection.onMessage.addListener((param) => {
  console.log('param: ', param);
});

connection.postMessage('welcome from offscreen message');
