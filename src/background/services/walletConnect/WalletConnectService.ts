import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import Core from '@walletconnect/core';
import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import {
  getAccountsFromNamespaces,
  getSdkError,
  getAddressesFromAccounts,
  getChainsFromNamespaces,
  parseChainId,
} from '@walletconnect/utils';

import { WalletConnectStorage } from './WalletConnectStorage';
import {
  ConnectOptions,
  WALLET_CONNECT_APP_METADATA,
  WalletConnectAccountInfo,
  WalletConnectError,
  WalletConnectErrorCode,
  WalletConnectEvent,
  buildSessionProposal,
  isNoMatchingKeyError,
  isProposalExpiredError,
} from './models';

@singleton()
export class WalletConnectService {
  #eventEmitter = new EventEmitter();
  #initialized = false;

  #core?: Core;
  #client?: SignClient;

  constructor(private storage: WalletConnectStorage) {}

  async #initialize() {
    if (this.#initialized) {
      return;
    }

    try {
      // Initialize WalletConnect core
      this.#core = new Core({
        projectId: process.env.WALLET_CONNECT_PROJECT_ID,
        storage: this.storage,
      });
      this.#setupPairingListeners(this.#core);

      // Initialize WalletConnect signing client
      this.#client = await SignClient.init({
        core: this.#core,
        metadata: WALLET_CONNECT_APP_METADATA,
      });
      this.#setupSessionListeners(this.#client);
      this.#initialized = true;
    } catch (err) {
      throw new WalletConnectError(
        'Unable to initialize the WalletConnect client',
        WalletConnectErrorCode.ClientInitFailed
      );
    }
  }

  // Always obtain the client instance via this method.
  // This way you ensure that the client has actually already been initialized,
  // and if it didn't - your operation will be queued to start after the client
  // has been initialized.
  async #getClient(): Promise<SignClient> {
    await this.#initialize();

    if (!this.#client) {
      // Technically shouldn't happen, but better be safe than sorry.
      // Also: TypeScript requirements.
      throw new WalletConnectError(
        'The WalletConnect client was not initialized properly',
        WalletConnectErrorCode.NoClient
      );
    }

    return this.#client;
  }

  async connect({
    chainId,
    tabId,
    reconnectionAddress,
  }: ConnectOptions): Promise<string | never> {
    const client = await this.#getClient();
    try {
      const { uri, approval } = await client.connect({
        // We could try to re-use the existing pairing, by providing a pairingTopic here,
        // but this requires more user-interaction flows to me designed and implemented.
        // Plus, if the mobile app is not using the latest WalletConnect SDKs (v2.9.0 or newer),
        // it would not be possible anyway.
        // So for now we'll just prompt the user to scan the QR code again, create
        // a new pairing and try to remove the existing one.
        requiredNamespaces: {
          eip155: buildSessionProposal({ chainId }),
        },
      });

      this.#eventEmitter.emit(WalletConnectEvent.UriGenerated, {
        uri,
        tabId,
      });

      const session = await approval();

      // Pick the first account.
      // TODO: should we allow multiple accounts to be imported at once?
      const [obtainedAddress] = this.#extractAddresses(session);

      if (!obtainedAddress) {
        throw new WalletConnectError(
          'Cannot retrieve the imported account',
          WalletConnectErrorCode.NoAccountsConnected
        );
      }

      if (!this.#isExpectedAddress(obtainedAddress, reconnectionAddress)) {
        // Remove the session if the user imported the wrong account.
        client.session.delete(
          session.topic,
          getSdkError('UNSUPPORTED_ACCOUNTS')
        );

        throw new WalletConnectError(
          'Imported account has a different address',
          WalletConnectErrorCode.IncorrectAddress
        );
      }

      return obtainedAddress;
    } catch (err) {
      return this.#handleError(err);
    }
  }

  #handleError(err: any): never {
    // If it's any of our own errors, just rethrow it
    if (err instanceof WalletConnectError) {
      throw err;
    }

    if (isProposalExpiredError(err)) {
      throw new WalletConnectError(
        'Session proposal expired',
        WalletConnectErrorCode.ProposalExpired
      );
    }

    console.error('WalletConnectService error:', err);

    throw new WalletConnectError(
      'Unable to connect via WalletConnect',
      WalletConnectErrorCode.UnknownError,
      err
    );
  }

  #isExpectedAddress(obtainedAddress: string, expectedAddress?: string) {
    return (
      !expectedAddress ||
      obtainedAddress.toLowerCase() === expectedAddress.toLowerCase()
    );
  }

  addListener(event: WalletConnectEvent, callback: (data: unknown) => void) {
    this.#eventEmitter.on(event, callback);
  }

  async getAccountInfo(
    lookupAddress: string
  ): Promise<null | WalletConnectAccountInfo> {
    const session = await this.#findSession(lookupAddress);

    if (!session) {
      return null;
    }

    const chains = this.#extractChains(session);

    return {
      address: lookupAddress,
      chains,
      walletApp: session.peer.metadata,
    };
  }

  #extractAddresses(session: SessionTypes.Struct): string[] {
    const accounts = getAccountsFromNamespaces(session.namespaces);

    return getAddressesFromAccounts(accounts);
  }

  #extractChains(session: SessionTypes.Struct): number[] {
    const chains = getChainsFromNamespaces(session.namespaces);

    return chains
      .map(parseChainId)
      .map(({ reference }) => reference)
      .map(Number);
  }

  async #findSession(
    lookupAddress: string
  ): Promise<SessionTypes.Struct | null> {
    const client = await this.#getClient();
    const sessions = client.session.getAll() ?? [];
    const foundSession = sessions.find((session) => {
      const sessionAddresses = this.#extractAddresses(session);

      return sessionAddresses.includes(lookupAddress);
    });

    return foundSession ?? null;
  }

  #setupSessionListeners(client: SignClient) {
    client.on('session_delete', async (event) => {
      try {
        await client.session.delete(
          event.topic,
          getSdkError('USER_DISCONNECTED')
        );
      } catch (ex: any) {
        // Ignore "no matching key" error, as it may be caused by the wallet app notifying
        // us of a session being deleted after we already cleaned it up.
        // In such scenario, there's no work to be done by us.
        if (isNoMatchingKeyError(ex)) {
          return;
        }
        throw ex;
      }
    });
  }

  #setupPairingListeners(core: Core) {
    // TODO: ask Core Mobile to dispatch this event when the user removes a connection
    core.pairing.events.on('pairing_delete', async (event) => {
      try {
        await core.pairing.pairings.delete(
          event.topic,
          getSdkError('USER_DISCONNECTED')
        );
      } catch (ex) {
        // Ignore "no matching key" error, as it may be caused by the wallet app notifying
        // us of a pairing being deleted after we already cleaned it up.
        // In such scenario, there's no work to be done by us.
        if (isNoMatchingKeyError(ex)) {
          return;
        }
        throw ex;
      }
    });
  }
}
