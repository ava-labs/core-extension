import {
  SolanaSignAndSendTransaction,
  type SolanaSignAndSendTransactionFeature,
  type SolanaSignAndSendTransactionMethod,
  type SolanaSignAndSendTransactionOutput,
  // type SolanaSignInMethod,
  // type SolanaSignInOutput,
  // type SolanaSignMessageMethod,
  // type SolanaSignMessageOutput,
  SolanaSignTransaction,
  type SolanaSignTransactionFeature,
  type SolanaSignTransactionMethod,
  type SolanaSignTransactionOutput,
} from '@solana/wallet-standard-features';
import type { Wallet } from '@wallet-standard/base';
import {
  StandardConnect,
  type StandardConnectFeature,
  type StandardConnectMethod,
  StandardDisconnect,
  type StandardDisconnectFeature,
  type StandardDisconnectMethod,
  StandardEvents,
  type StandardEventsFeature,
  type StandardEventsListeners,
  type StandardEventsNames,
  type StandardEventsOnMethod,
} from '@wallet-standard/features';
import { base58, base64 } from '@scure/base';
import { CoreWalletAccount } from './account';
import { icon } from './icon';
import type { SolanaChain } from './solana';
import { getSolanaCaip2Id, isSolanaChain, SOLANA_CHAINS } from './solana';
import { bytesEqual } from './util';
import type { Core } from './window';

export const CoreNamespace = 'core:';

export type CoreFeature = {
  [CoreNamespace]: {
    core: Core;
  };
};

export class CoreWallet implements Wallet {
  readonly #listeners: {
    [E in StandardEventsNames]?: StandardEventsListeners[E][];
  } = {};
  readonly #version = '1.0.0' as const;
  readonly #name = 'Core' as const;
  readonly #icon = icon;
  #account: CoreWalletAccount | null = null;
  readonly #core: Core;

  get version() {
    return this.#version;
  }

  get name() {
    return this.#name;
  }

  get icon() {
    return this.#icon;
  }

  get chains() {
    return SOLANA_CHAINS.slice();
  }

  get features(): StandardConnectFeature &
    StandardDisconnectFeature &
    StandardEventsFeature &
    SolanaSignAndSendTransactionFeature &
    SolanaSignTransactionFeature &
    // SolanaSignMessageFeature &
    // SolanaSignInFeature &
    CoreFeature {
    return {
      [StandardConnect]: {
        version: '1.0.0',
        connect: this.#connect,
      },
      [StandardDisconnect]: {
        version: '1.0.0',
        disconnect: this.#disconnect,
      },
      [StandardEvents]: {
        version: '1.0.0',
        on: this.#on,
      },
      [SolanaSignAndSendTransaction]: {
        version: '1.0.0',
        supportedTransactionVersions: ['legacy', 0],
        signAndSendTransaction: this.#signAndSendTransaction,
      },
      [SolanaSignTransaction]: {
        version: '1.0.0',
        supportedTransactionVersions: ['legacy', 0],
        signTransaction: this.#signTransaction,
      },
      // [SolanaSignMessage]: {
      //   version: '1.0.0',
      //   signMessage: this.#signMessage,
      // },
      // [SolanaSignIn]: {
      //   version: '1.0.0',
      //   signIn: this.#signIn,
      // },
      [CoreNamespace]: {
        core: this.#core,
      },
    };
  }

  get accounts() {
    return this.#account ? [this.#account] : [];
  }

  constructor(core: Core) {
    if (new.target === CoreWallet) {
      Object.freeze(this);
    }

    this.#core = core;

    core.on('connect', this.#connected, this);
    core.on('disconnect', this.#disconnected, this);
    core.on('accountChanged', this.#reconnected, this);

    this.#connected();
  }

  #on: StandardEventsOnMethod = (event, listener) => {
    this.#listeners[event] ??= [];
    this.#listeners[event]?.push(listener);

    return (): void => this.#off(event, listener);
  };

  #emit<E extends StandardEventsNames>(
    event: E,
    ...args: Parameters<StandardEventsListeners[E]>
  ): void {
    // eslint-disable-next-line prefer-spread
    this.#listeners[event]?.forEach((listener) => listener.apply(null, args));
  }

  #off<E extends StandardEventsNames>(
    event: E,
    listener: StandardEventsListeners[E],
  ): void {
    this.#listeners[event] = this.#listeners[event]?.filter(
      (existingListener) => listener !== existingListener,
    );
  }

  #connected = () => {
    const address = this.#core.publicKey?.toBase58();
    if (address) {
      const publicKey = this.#core.publicKey!.toBytes();

      const account = this.#account;
      if (
        !account ||
        account.address !== address ||
        !bytesEqual(account.publicKey, publicKey)
      ) {
        this.#account = new CoreWalletAccount({ address, publicKey });
        this.#emit('change', { accounts: this.accounts });
      }
    }
  };

  #disconnected = () => {
    if (this.#account) {
      this.#account = null;
      this.#emit('change', { accounts: this.accounts });
    }
  };

  #reconnected = () => {
    if (this.#core.publicKey) {
      this.#connected();
    } else {
      this.#disconnected();
    }
  };

  #connect: StandardConnectMethod = async ({ silent } = {}) => {
    if (!this.#account) {
      await this.#core.connect(silent ? { onlyIfTrusted: true } : undefined);
    }

    this.#connected();

    return { accounts: this.accounts };
  };

  #disconnect: StandardDisconnectMethod = async () => {
    await this.#core.disconnect();
  };

  #signAndSendTransaction: SolanaSignAndSendTransactionMethod = async (
    ...inputs
  ) => {
    if (!this.#account) throw new Error('not connected');

    const outputs: SolanaSignAndSendTransactionOutput[] = [];

    if (inputs.length === 1) {
      const { transaction, account, chain, options } = inputs[0]!;
      const { minContextSlot, preflightCommitment, skipPreflight, maxRetries } =
        options || {};
      if (account !== this.#account) throw new Error('invalid account');
      if (!isSolanaChain(chain)) throw new Error('invalid chain');

      const signature = await this.#core.signAndSendTransaction(
        this.#account.address,
        getSolanaCaip2Id(chain),
        base64.encode(transaction),
        {
          preflightCommitment,
          minContextSlot,
          maxRetries,
          skipPreflight,
        },
      );

      outputs.push({ signature: base58.decode(signature) });
    } else if (inputs.length > 1) {
      for (const input of inputs) {
        outputs.push(...(await this.#signAndSendTransaction(input)));
      }
    }

    return outputs;
  };

  #signTransaction: SolanaSignTransactionMethod = async (...inputs) => {
    if (!this.#account) throw new Error('not connected');

    const outputs: SolanaSignTransactionOutput[] = [];

    if (inputs.length === 1) {
      const { transaction, account, chain } = inputs[0]!;
      if (account !== this.#account) throw new Error('invalid account');
      if (chain && !isSolanaChain(chain)) throw new Error('invalid chain');

      const signedTransaction = await this.#core.signTransaction(
        this.#account.address,
        getSolanaCaip2Id(chain || SOLANA_CHAINS[0]),
        base64.encode(transaction),
      );

      outputs.push({ signedTransaction: base64.decode(signedTransaction) });
    } else if (inputs.length > 1) {
      let chain: SolanaChain | undefined = undefined;
      for (const input of inputs) {
        if (input.account !== this.#account) throw new Error('invalid account');
        if (input.chain) {
          if (!isSolanaChain(input.chain)) throw new Error('invalid chain');
          if (chain) {
            if (input.chain !== chain) throw new Error('conflicting chain');
          } else {
            chain = input.chain;
          }
        }
      }

      const transactions = inputs.map(({ transaction }) =>
        base64.encode(transaction),
      );

      const signedTransactions = await this.#core.signAllTransactions(
        this.#account.address,
        getSolanaCaip2Id(chain || SOLANA_CHAINS[0]),
        transactions,
      );

      outputs.push(
        ...signedTransactions.map((signedTransaction) => ({
          signedTransaction: base64.decode(signedTransaction),
        })),
      );
    }

    return outputs;
  };

  // #signMessage: SolanaSignMessageMethod = async (...inputs) => {
  //   if (!this.#account) throw new Error('not connected');

  //   const outputs: SolanaSignMessageOutput[] = [];

  //   if (inputs.length === 1) {
  //     const { message, account } = inputs[0]!;
  //     if (account !== this.#account) throw new Error('invalid account');

  //     const { signature } = await this.#core.signMessage(message);

  //     outputs.push({ signedMessage: message, signature });
  //   } else if (inputs.length > 1) {
  //     for (const input of inputs) {
  //       outputs.push(...(await this.#signMessage(input)));
  //     }
  //   }

  //   return outputs;
  // };

  // #signIn: SolanaSignInMethod = async (...inputs) => {
  //   const outputs: SolanaSignInOutput[] = [];

  //   if (inputs.length > 1) {
  //     for (const input of inputs) {
  //       outputs.push(await this.#core.signIn(input));
  //     }
  //   } else {
  //     return [await this.#core.signIn(inputs[0])];
  //   }

  //   return outputs;
  // };
}
