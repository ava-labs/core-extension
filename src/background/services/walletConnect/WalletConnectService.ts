import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import Core from '@walletconnect/core';
import SignClient from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';
import {
  getAccountsFromNamespaces,
  getSdkError,
  getAddressesFromAccounts,
  getChainsFromNamespaces,
  parseChainId,
} from '@walletconnect/utils';
import { intToHex } from 'ethereumjs-util';

import { areArraysOverlapping } from '@src/utils/array';
import { isDevelopment } from '@src/utils/environment';

import type { WalletConnectStorage } from './WalletConnectStorage';
import type {
  ConnectOptions,
  RequestOptions,
  RequestPayload,
  WalletConnectSessionInfo,
  WalletConnectTransport,
} from './models';
import {
  WALLET_CONNECT_APP_METADATA,
  WalletConnectError,
  WalletConnectErrorCode,
  WalletConnectEvent,
  isNoMatchingKeyError,
  isProposalExpiredError,
} from './models';
import { buildSessionProposal } from './utils';
import type { WalletConnectAddresses } from '../accounts/models';
import { isUserRejectionError } from '@src/utils/errors';

@singleton()
export class WalletConnectService implements WalletConnectTransport {
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
        logger: isDevelopment() ? 'info' : 'error',
      });
      this.#setupPairingListeners(this.#core);

      // Initialize WalletConnect signing client
      this.#client = await SignClient.init({
        core: this.#core,
        metadata: WALLET_CONNECT_APP_METADATA,
      });
      this.#setupSessionListeners(this.#client);
      this.#initialized = true;
    } catch (_err) {
      throw new WalletConnectError(
        'Unable to initialize the WalletConnect client',
        WalletConnectErrorCode.ClientInitFailed,
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
        WalletConnectErrorCode.NoClient,
      );
    }

    return this.#client;
  }

  async establishRequiredSession({
    chainId,
    fromAddress,
    tabId,
  }: RequestOptions): Promise<null | WalletConnectSessionInfo> {
    const requiredSession = await this.getSessionInfo(fromAddress, chainId);

    // A required session is one that permits us to send the request
    // described by the request options provided as a parameter.
    // It's specific to the "from" account AND the source network.
    // If we found such a session, life is good.
    if (requiredSession) {
      return requiredSession;
    }

    // Checking if there is valid session available for the source account,
    // without specifying the network.
    const accountSession = await this.getSessionInfo(fromAddress);

    if (!accountSession) {
      // If we don't have a session like that either, we'll request the user
      // to reconnect by scanning the QR code again.
      return this.connect({ chainId, address: fromAddress, tabId });
    }

    /**
     * If we have a session for the source account, but not for the required chain,
     * we can try to switch the network on the mobile device.
     *
     * Some mobile apps (e.g. Metamask) will automatically add the new chain to the
     * active session's permissions after the user approves such a request.
     * This allows us to just send the requests without additional user interaction.
     */
    this.#eventEmitter.emit(WalletConnectEvent.SessionPermissionsMismatch, {
      tabId,
      activeSession: accountSession,
      requiredPermissions: {
        address: fromAddress,
        chainId,
      },
    });

    // Send a network switch request to the device.
    try {
      await this.request(
        {
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: intToHex(chainId) }],
        },
        {
          chainId: accountSession.chains[0] as number,
          tabId,
          fromAddress: accountSession.addresses[0],
        },
      );
    } catch {
      // If this request throws an error for whatever reason,
      // initiate pairing by showing the QR code.
      return this.connect({ chainId, address: fromAddress, tabId });
    }

    /**
     * Not all apps will extend the session permissions though, so we need to revalidate
     * the session after the network was switched.
     *
     * We do it by looking for a "sufficient" session again, that is one that permits
     * us to interact with the active account and the active chain at the same time.
     */

    const hopefullySufficientSession = await this.getSessionInfo(
      fromAddress,
      chainId,
    );

    // At this point we either find a sufficient session or we don't.
    // If we don't - we require a brand new connection to be established.
    if (!hopefullySufficientSession) {
      return this.connect({ chainId, address: fromAddress, tabId });
    }

    // If we do - we use the extended session.
    return hopefullySufficientSession;
  }

  async request<T = string>(
    { method, params }: RequestPayload,
    { chainId, fromAddress, expiry }: RequestOptions,
  ): Promise<T | never> {
    const client = await this.#getClient();

    const sessionInfo = await this.getSessionInfo(fromAddress, chainId);

    // If no session, throw an error.
    if (!sessionInfo) {
      throw new Error('Session expired, please reconnect');
    }

    try {
      const result = await client.request<T>({
        topic: sessionInfo.topic,
        chainId: `eip155:${chainId}`,
        request: { method, params },
        expiry,
      });
      return result;
    } catch (err) {
      this.#handleError(err);
    }
  }

  async connect({
    chainId,
    tabId,
    address,
  }: ConnectOptions): Promise<WalletConnectSessionInfo | never> {
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

      const session = this.#mapSessionInfo(await approval());

      // Pick the first account.
      // TODO: should we allow multiple accounts to be imported at once?
      const [obtainedAddress] = session.addresses;

      if (!obtainedAddress) {
        throw new WalletConnectError(
          'Cannot retrieve the imported account',
          WalletConnectErrorCode.NoAccountsConnected,
        );
      }

      if (!this.#isExpectedAddress(obtainedAddress, address)) {
        // Remove the session if the user imported the wrong account.
        client.session.delete(
          session.topic,
          getSdkError('UNSUPPORTED_ACCOUNTS'),
        );

        throw new WalletConnectError(
          'Imported account has a different address',
          WalletConnectErrorCode.IncorrectAddress,
        );
      }

      // Remove old sessions with overlapping credentials to prevent any weird
      // stuff from happening (e.g. requests being sent to a different wallet,
      // because the user connected with a different device this time).
      await this.#deduplicateSessions(session);

      return session;
    } catch (err) {
      return this.#handleError(err);
    }
  }

  async #deduplicateSessions(activeSession: WalletConnectSessionInfo) {
    const client = await this.#getClient();
    const sessions = client.session.getAll();
    const duplicatedSessions = sessions
      // Leave the active session in tact
      .filter(({ topic }) => topic !== activeSession.topic)
      // Find other sessions that share the same credentials (account address / chain id)
      .filter((session) => {
        const oldSession = this.#mapSessionInfo(session);

        const addressesOverlap = areArraysOverlapping(
          activeSession.addresses,
          oldSession.addresses,
        );
        const chainsOverlap = areArraysOverlapping(
          activeSession.chains,
          oldSession.chains,
        );

        return addressesOverlap && chainsOverlap;
      });

    await duplicatedSessions.forEach(async ({ topic, pairingTopic }) => {
      await client.session.delete(topic, getSdkError('USER_DISCONNECTED'));

      if (pairingTopic) {
        await client.pairing.delete(
          pairingTopic,
          getSdkError('USER_DISCONNECTED'),
        );
      }
    });
  }

  #handleError(err: any): never {
    // If it's any of our own errors, just rethrow it
    if (err instanceof WalletConnectError) {
      throw err;
    }

    if (isUserRejectionError(err)) {
      throw new WalletConnectError(
        'User rejected the request',
        WalletConnectErrorCode.UserRejected,
      );
    }

    if (isProposalExpiredError(err)) {
      throw new WalletConnectError(
        'Session proposal expired',
        WalletConnectErrorCode.ProposalExpired,
      );
    }

    console.error('WalletConnectService error:', err);

    throw new WalletConnectError(
      'Unable to connect via WalletConnect',
      WalletConnectErrorCode.UnknownError,
      err,
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

  #mapSessionInfo(session: SessionTypes.Struct): WalletConnectSessionInfo {
    const chains = this.#extractChains(session);
    const addresses = this.#extractAddresses(session);

    return {
      topic: session.topic,
      addresses,
      chains,
      walletApp: session.peer.metadata,
    };
  }

  async getSessionInfo(
    lookupAddress: string,
    chainId?: number,
  ): Promise<null | WalletConnectSessionInfo> {
    const session = await this.#findSession(lookupAddress, chainId);

    if (!session) {
      return null;
    }

    return this.#mapSessionInfo(session);
  }

  #extractAddresses(session: SessionTypes.Struct): [string, ...string[]] {
    const accounts = getAccountsFromNamespaces(session.namespaces);

    // We know there is at least one address there, because we checked upon connection
    return getAddressesFromAccounts(accounts) as [string, ...string[]];
  }

  #extractChains(session: SessionTypes.Struct): [number, ...number[]] {
    const chains = getChainsFromNamespaces(session.namespaces);

    return chains
      .map(parseChainId)
      .map(({ reference }) => reference)
      .map(Number) as [number, ...number[]];
  }

  async #findSession(
    lookupAddress: string,
    chainId?: number,
  ): Promise<SessionTypes.Struct | null> {
    const client = await this.#getClient();
    const sessions = client.session.getAll() ?? [];
    const foundSession = sessions.find((session) => {
      const sessionAddresses = this.#extractAddresses(session);
      const chains = this.#extractChains(session);
      const hasRequiredAddress = sessionAddresses.includes(lookupAddress);
      const hasRequiredChain =
        typeof chainId === 'number' ? chains.includes(chainId) : true;

      return hasRequiredAddress && hasRequiredChain;
    });

    return foundSession ?? null;
  }
  //set up a lister for network changes
  // Subscribe to as many events as possible and log it out
  // eth_chainId
  #setupSessionListeners(client: SignClient) {
    client.on('session_delete', async (event) => {
      try {
        await client.session.delete(
          event.topic,
          getSdkError('USER_DISCONNECTED'),
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
          getSdkError('USER_DISCONNECTED'),
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

  async avalancheGetAccounts(
    options: RequestOptions,
  ): Promise<WalletConnectAddresses[]> {
    return this.request<WalletConnectAddresses[]>(
      {
        method: 'avalanche_getAccounts',
        params: [],
      },
      options,
    );
  }

  async deleteSession(address: string) {
    const client = await this.#getClient();
    const sessions = client.session.getAll() ?? [];

    await sessions.forEach(async (session) => {
      const sessionAddresses = this.#extractAddresses(session);
      const hasRequiredAddress = sessionAddresses.includes(address);

      if (hasRequiredAddress) {
        try {
          await client.session.delete(
            session.topic,
            getSdkError('USER_DISCONNECTED'),
          );

          if (session.pairingTopic) {
            await client.pairing.delete(
              session.pairingTopic,
              getSdkError('USER_DISCONNECTED'),
            );
          }
        } catch (ex) {
          if (isNoMatchingKeyError(ex)) {
            return;
          }
          throw ex;
        }
      }
    });
  }
}
