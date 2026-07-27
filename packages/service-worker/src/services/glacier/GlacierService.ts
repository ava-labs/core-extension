import { Glacier } from '@avalabs/glacier-sdk';
import { singleton } from 'tsyringe';

import { Monitoring } from '@core/common';

import { AppCheckService } from '../appcheck/AppCheckService';

import { HEADERS } from './glacierConfig';

@singleton()
export class GlacierService {
  constructor(private appCheckService: AppCheckService) {}

  async #getClient() {
    try {
      const appcheckToken = await this.appCheckService.getAppcheckToken();
      if (!appcheckToken) {
        throw new Error('No appcheck token found');
      }
      return new Glacier({
        BASE: process.env.GLACIER_URL,
        HEADERS: {
          ...HEADERS,
          'X-Firebase-AppCheck': appcheckToken.token,
        },
      });
    } catch (error) {
      console.error('Error insantiating a Glacier client:', error);
      Monitoring.sentryCaptureException(
        error as Error,
        Monitoring.SentryExceptionTypes.FIREBASE,
      );
      throw error;
    }
  }

  async getEvmChainsForAddress(address: string) {
    const client = await this.#getClient();
    return client.evmChains.listAddressChains({
      address,
    });
  }
}
