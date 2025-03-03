import browser, { Runtime } from 'webextension-polyfill';
import { OFFSCREEN_SCRIPT } from './common';
import { GaslessSdk } from '@avalabs/core-gasless-sdk';
import { ExtensionRequest } from './background/connections/extensionConnection/models';

const connection: Runtime.Port = browser.runtime.connect({
  name: OFFSCREEN_SCRIPT,
});

connection.onMessage.addListener(async (param) => {
  const params = JSON.parse(param);
  const { value } = params;
  const { token, message } = value;
  const sdk = new GaslessSdk('https://core-gas-station.avax-test.network', {
    appCheckToken: token,
  });

  const { difficulty, challengeHex } = await sdk.fetchChallenge();
  const { solutionHex } = await sdk.solveChallenge(challengeHex, difficulty);
  connection.postMessage(
    JSON.stringify({
      params: {
        request: {
          method: ExtensionRequest.GASLESS_GET_CHALLENGE_HEX,
          tabId: -1,
          params: {
            solutionHex,
            challengeHex,
            pipelineIndex: message.pipelineIndex ?? undefined,
          },
        },
      },
    }),
  );
});
