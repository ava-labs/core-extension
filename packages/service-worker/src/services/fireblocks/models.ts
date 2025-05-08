// import type { KeyLike } from 'jose';

export abstract class FireblocksSecretsProvider {
  abstract getSecrets(): Promise<{ apiKey: string; privateKey: any }>;
}
