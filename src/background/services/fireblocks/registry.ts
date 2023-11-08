import { registry } from 'tsyringe';

import { FireblocksSecretsService } from './FireblocksSecretsService';

@registry([
  { token: 'FireblocksSecretsProvider', useToken: FireblocksSecretsService },
])
export class FireblocksRegistry {}
