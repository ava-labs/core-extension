import browser, { Runtime } from 'webextension-polyfill';
import { OFFSCREEN_SCRIPT } from '../packages/common/src/script-names';
import { GaslessSdk } from '@avalabs/core-gasless-sdk';
import { ExtensionRequest } from '@core/types/src/models';
import { GaslessEvents } from '@core/types/src/model';

const connection: Runtime.Port = browser.runtime.connect({
  name: OFFSCREEN_SCRIPT,
});

connection.onMessage.addListener(async (param: string) => {
  const params: {
    name: string;
    value: {
      request: string;
      token: string;
      message: {
        pipelineIndex?: number;
      };
    };
  } = JSON.parse(param);
  const { value, name } = params;
  if (
    name !== GaslessEvents.SEND_OFFSCREEN_MESSAGE ||
    value.request !== ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE
  ) {
    throw new Error('Incorrect offscreen message or request name');
  }
  const { token, message } = value;
  const gasStationUrl = process.env.GASLESS_SERVICE_URL;

  if (!gasStationUrl) {
    throw new Error('GASLESS_SERVICE_URL is missing');
  }

  const sdk = new GaslessSdk(gasStationUrl, {
    appCheckToken: token,
  });

  const { difficulty, challengeHex } = await sdk.fetchChallenge();
  const { solutionHex } = await sdk.solveChallenge(challengeHex, difficulty);
  connection.postMessage(
    JSON.stringify({
      params: {
        request: {
          method: ExtensionRequest.GASLESS_SET_HEX_VALUES,
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
