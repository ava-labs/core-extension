import browser, { Runtime } from 'webextension-polyfill';
import { OFFSCREEN_SCRIPT } from './common';
import { GaslessSdk } from '@avalabs/core-gasless-sdk';

// console.log('fetchChallenge: ', fetchChallenge);
console.log('offsreen starting....');
const connection: Runtime.Port = browser.runtime.connect({
  name: OFFSCREEN_SCRIPT,
});
console.log('newConnection2: ', connection);

connection.onMessage.addListener(async (param) => {
  console.log('param: ', param);
  const params = JSON.parse(param);
  console.log('params: ', params);
  const sdk = new GaslessSdk({
    gasStationUrl: 'https://core-gas-station.avax-test.network',
  });
  const isGaslessAvailable = await sdk.isEligibleForChain('1');
  const isGaslessAvailable2 = await sdk.isEligibleForChain('43114');
  console.log('isGaslessAvailable: ', isGaslessAvailable);
  console.log('isGaslessAvailable2: ', isGaslessAvailable2);
});

connection.postMessage('welcome from offscreen message');
