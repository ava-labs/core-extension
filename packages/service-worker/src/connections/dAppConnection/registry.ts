import { runtime } from 'webextension-polyfill';

import { AccountsChangedEvents } from '../../services/accounts/events/accountsChangedEvent';
import { AvalancheGetAccountsHandler } from '../../services/accounts/handlers/avalanche_getAccounts';
import { AvalancheAddAccountHandler } from '../../services/accounts/handlers/avalanche_addAccount';
import { AvalancheSelectAccountHandler } from '../../services/accounts/handlers/avalanche_selectAccount';
import { EthAccountsHandler } from '../../services/accounts/handlers/eth_accounts';
import { ActionEvents } from '../../services/actions/events/actionEvents';
import { AvalancheGetBridgeTransactionHandler } from '../../services/bridge/handlers/avalanche_getBridgeState';
import { AvalancheGetContactsHandler } from '../../services/contacts/handlers/avalanche_getContacts';
import { AvalancheCreateContactHandler } from '../../services/contacts/handlers/avalanche_createContact';
import { AvalancheUpdateContactHandler } from '../../services/contacts/handlers/avalanche_updateContact';
import { AvalancheRemoveContactHandler } from '../../services/contacts/handlers/avalanche_removeContact';
import { PersonalEcRecoverHandler } from '../../services/messages/handlers/personal_ecRecover';
import { PersonalSignHandler } from '../../services/messages/handlers/signMessage';
import { ChainChangedEvents } from '../../services/network/events/chainChangedEvent';
import { WalletAddEthereumChainHandler } from '../../services/network/handlers/wallet_addEthereumChain';
import { WalletSwitchEthereumChainHandler } from '../../services/network/handlers/wallet_switchEthereumChain';
import { AvalancheSetDeveloperModeHandler } from '../../services/network/handlers/avalanche_setDeveloperMode';
import { WalletGetPermissionsHandler } from '../../services/permissions/handlers/wallet_getPermissions';
import { WalletRequestPermissionsHandler } from '../../services/permissions/handlers/wallet_requestPermissions';
import { WalletWatchAssetHandler } from '../../services/settings/events/wallet_watchAsset';
import { WalletGetEthereumChainHandler } from '../../services/network/handlers/wallet_getEthereumChain';
import { AvalancheSelectWalletHandler } from '../../services/web3/handlers/avalanche_selectWallet';
import { ConnectRequestHandler } from '../../services/web3/handlers/connect';
import { AvalancheGetProviderState } from '../../services/web3/handlers/avalanche_getProviderState';
import { AvalancheSendDomainMetadataHandler } from '../../services/web3/handlers/avalanche_sendDomainMetadata';
import { registry } from 'tsyringe';
import { AvalancheGetAccountPubKeyHandler } from '../../services/accounts/handlers/avalanche_getAccountPubKey';
import { AvalancheSendTransactionHandler } from '../../services/wallet/handlers/avalanche_sendTransaction';
import { AvalancheGetAddressesInRangeHandler } from '../../services/accounts/handlers/avalanche_getAddressesInRange';
import { AvalancheSignTransactionHandler } from '../../services/wallet/handlers/avalanche_signTransaction';
import { AvalancheSignMessageHandler } from '../../services/messages/handlers/avalanche_signMessage';
import { AvalancheRenameAccountHandler } from '../../services/accounts/handlers/avalanche_renameAccount';
import { AvalancheRenameWalletHandler } from '../../services/secrets/handlers/avalanche_renameWallet';
import { WalletAddNetworkHandler } from '../../services/network/handlers/wallet_addNetwork';
import { AvalancheDeleteAccountsHandler } from '../../services/accounts/handlers/avalanche_deleteAccounts';
import { AccountsChangedCAEvents } from '../../services/accounts/events/accountsChangedCAEvent';
import { RequestAccountPermissionHandler } from '../../services/web3/handlers/wallet_requestAccountPermission';
import { WalletGetNetworkStateHandler } from '~/services/network/handlers/wallet_getNetworkState';
import { NetworkStateChangedEvents } from '~/services/network/events/networkStateChanged';
import { SettingsUpdatedEventsCore } from '~/services/settings/events/settingsUpdatedEventCore';
import { WalletSetSettingsHandler } from '~/services/settings/handlers/wallet_setSettings';
import { WalletGetSettingsHandler } from '~/services/settings/handlers/wallet_getSettings';
import { WalletGetCapabilitiesHandler } from '../../services/web3/handlers/wallet_getCapabilities';

/**
 * TODO: GENERATE THIS FILE AS PART OF THE BUILD PROCESS
 * There is no automativ module discovery in ts like available in java,
 * if a module is not imported ever, the DI will never know about it
 */

const SHARED_HANDLERS = [
  { token: 'DAppRequestHandler', useToken: AvalancheGetAccountsHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheAddAccountHandler },
  { token: 'DAppRequestHandler', useToken: EthAccountsHandler },
  {
    token: 'DAppRequestHandler',
    useToken: AvalancheGetBridgeTransactionHandler,
  },
  { token: 'DAppRequestHandler', useToken: AvalancheGetContactsHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheCreateContactHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheUpdateContactHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheRemoveContactHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSelectWalletHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSelectAccountHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheGetAccountPubKeyHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheRenameAccountHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheDeleteAccountsHandler },
  {
    token: 'DAppRequestHandler',
    useToken: AvalancheGetAddressesInRangeHandler,
  },
  { token: 'DAppRequestHandler', useToken: PersonalEcRecoverHandler },
  { token: 'DAppRequestHandler', useToken: WalletAddEthereumChainHandler },
  { token: 'DAppRequestHandler', useToken: WalletSwitchEthereumChainHandler },
  { token: 'DAppRequestHandler', useToken: WalletGetEthereumChainHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSetDeveloperModeHandler },
  { token: 'DAppRequestHandler', useToken: WalletGetPermissionsHandler },
  { token: 'DAppRequestHandler', useToken: WalletRequestPermissionsHandler },
  { token: 'DAppRequestHandler', useToken: WalletWatchAssetHandler },
  { token: 'DAppRequestHandler', useToken: ConnectRequestHandler },
  { token: 'DAppRequestHandler', useToken: RequestAccountPermissionHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheGetProviderState },
  { token: 'DAppRequestHandler', useToken: AvalancheRenameWalletHandler },
  { token: 'DAppRequestHandler', useToken: WalletAddNetworkHandler },
  {
    token: 'DAppRequestHandler',
    useToken: AvalancheSendDomainMetadataHandler,
  },
  {
    token: 'DAppRequestHandler',
    useToken: WalletGetNetworkStateHandler,
  },
  { token: 'DAppRequestHandler', useToken: WalletGetSettingsHandler },
  { token: 'DAppRequestHandler', useToken: WalletSetSettingsHandler },
  { token: 'DAppRequestHandler', useToken: WalletGetCapabilitiesHandler },
];

const LEGACY_REQUEST_HANDLERS = [
  { token: 'DAppRequestHandler', useToken: AvalancheSendTransactionHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSignTransactionHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSignMessageHandler },
  { token: 'DAppRequestHandler', useToken: PersonalSignHandler },
];

// In order to only switch the NextGen app to use the VM Modules for
// the remaining request types, we recognize if we're in the NextGen app
// and only add the local request handlers if we're not.

const NEXT_GEN_LOCAL_ID = 'kgoihbeifdgeehmjjapgdgdlghbajemb';
const NEXT_GEN_BLUE_ID = 'eacmbmdlcjonknhdlboigobpcjaojfgn';
const useLocalRequestHandlers =
  runtime.id !== NEXT_GEN_LOCAL_ID && runtime.id !== NEXT_GEN_BLUE_ID;

const ALL_REQUEST_HANDLERS = [
  ...SHARED_HANDLERS,
  // TODO: This check should be completely removed and the ${LEGACY_REQUEST_HANDLERS}
  // should no longer be used when we release the NextGen app.
  ...(useLocalRequestHandlers ? LEGACY_REQUEST_HANDLERS : []),
];

@registry(ALL_REQUEST_HANDLERS)
export class DappRequestHandlerRegistry {}

/**
 * Make sure these event emitter are NOT singletons.
 * Always use @injectable unless it's absolutely necessary.
 * Using singletons would broadcast events to every webpage,
 * as opposed to the ones connected.
 *
 * Note: Lifecycle callbacks (onLock, onUnlock, etc...) don't work with @injectable classes
 * since the DI framework does not keep count of the created objects
 */
@registry([
  { token: 'DAppEventEmitter', useToken: AccountsChangedEvents },
  { token: 'DAppEventEmitter', useToken: AccountsChangedCAEvents },
  { token: 'DAppEventEmitter', useToken: ChainChangedEvents },
  { token: 'DAppEventEmitter', useToken: ActionEvents },
  { token: 'DAppEventEmitter', useToken: NetworkStateChangedEvents },
  { token: 'DAppEventEmitter', useToken: SettingsUpdatedEventsCore },
])
export class DappEventEmitterRegistry {}
