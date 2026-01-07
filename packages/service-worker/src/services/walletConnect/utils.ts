import { ProposalTypes } from '@walletconnect/types';

import { CORE_MOBILE_WALLET_ID, WalletConnectSessionInfo } from '@core/types';

export const isCoreMobile = (session: WalletConnectSessionInfo) =>
  session.walletApp.walletId === CORE_MOBILE_WALLET_ID;

type SessionProposalOptions = {
  chainId: number;
};

export const buildSessionProposal = ({
  chainId,
}: SessionProposalOptions): ProposalTypes.BaseRequiredNamespace => ({
  methods: [
    /**
     * We should keep this list modest.
     *
     * The most crucial wallets that we tested (Metamask, Core Mobile, Fireblocks)
     * will still populate this list with more methods that they support.
     *
     * For example, Fireblocks will add eth_signTransaction, but we can't hardcode
     * it as a requirement, as then connecting to Core Mobile or Metamask would fail
     * (since they do not support that method).
     */
    'eth_sendTransaction',
    'eth_signTypedData',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4',
    'eth_sign',
    'personal_sign',
    'wallet_switchEthereumChain',
    'wallet_addEthereumChain',
  ],
  events: ['chainChanged', 'accountsChanged'],
  /**
   * We specify a single chain here, since some apps will not allow us to request
   * more chains than just one upon initial connection (i.e. Metamask).
   *
   * Some apps (i.e. Metamask again) will allow us to extend that list by sending
   * a wallet_switchEthereumChain request. If the user approves such a request,
   * the session permissions will be upgraded.
   *
   * Other apps (i.e. Core Mobile) will not allow us to get access to a different chain
   * in this way, so we also need to support a different flow, where for each network
   * we establish a new session (forcing the user to scan the QR code). This is subject
   * to change if this feature is implemented: https://ava-labs.atlassian.net/browse/CP-7079.
   */
  chains: [`eip155:${chainId}`],
});
