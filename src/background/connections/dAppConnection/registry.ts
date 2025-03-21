import { AccountsChangedEvents } from '@src/background/services/accounts/events/accountsChangedEvent';
import { AvalancheGetAccountsHandler } from '@src/background/services/accounts/handlers/avalanche_getAccounts';
import { AvalancheSelectAccountHandler } from '@src/background/services/accounts/handlers/avalanche_selectAccount';
import { EthAccountsHandler } from '@src/background/services/accounts/handlers/eth_accounts';
import { ActionEvents } from '@src/background/services/actions/events/actionEvents';
import { AvalancheBridgeAsset } from '@src/background/services/bridge/handlers/avalanche_bridgeAsset';
import { AvalancheGetBridgeTransactionHandler } from '@src/background/services/bridge/handlers/avalanche_getBridgeState';
import { AvalancheGetContactsHandler } from '@src/background/services/contacts/handlers/avalanche_getContacts';
import { AvalancheCreateContactHandler } from '@src/background/services/contacts/handlers/avalanche_createContact';
import { AvalancheUpdateContactHandler } from '@src/background/services/contacts/handlers/avalanche_updateContact';
import { AvalancheRemoveContactHandler } from '@src/background/services/contacts/handlers/avalanche_removeContact';
import { PersonalEcRecoverHandler } from '@src/background/services/messages/handlers/personal_ecRecover';
import { PersonalSignHandler } from '@src/background/services/messages/handlers/signMessage';
import { ChainChangedEvents } from '@src/background/services/network/events/chainChangedEvent';
import { WalletAddEthereumChainHandler } from '@src/background/services/network/handlers/wallet_addEthereumChain';
import { WalletSwitchEthereumChainHandler } from '@src/background/services/network/handlers/wallet_switchEthereumChain';
import { AvalancheSetDeveloperModeHandler } from '@src/background/services/network/handlers/avalanche_setDeveloperMode';
import { WalletGetPermissionsHandler } from '@src/background/services/permissions/handlers/wallet_getPermissions';
import { WalletRequestPermissionsHandler } from '@src/background/services/permissions/handlers/wallet_requestPermissions';
import { WalletWatchAssetHandler } from '@src/background/services/settings/events/wallet_watchAsset';
import { WalletGetEthereumChainHandler } from '@src/background/services/network/handlers/wallet_getEthereumChain';
import { AvalancheSelectWalletHandler } from '@src/background/services/web3/handlers/avalanche_selectWallet';
import { ConnectRequestHandler } from '@src/background/services/web3/handlers/connect';
import { AvalancheGetProviderState } from '@src/background/services/web3/handlers/avalanche_getProviderState';
import { AvalancheSendDomainMetadataHandler } from '@src/background/services/web3/handlers/avalanche_sendDomainMetadata';
import { registry } from 'tsyringe';
import { AvalancheGetAccountPubKeyHandler } from '@src/background/services/accounts/handlers/avalanche_getAccountPubKey';
import { AvalancheSendTransactionHandler } from '@src/background/services/wallet/handlers/avalanche_sendTransaction';
import { AvalancheGetAddressesInRangeHandler } from '@src/background/services/accounts/handlers/avalanche_getAddressesInRange';
import { AvalancheSignTransactionHandler } from '@src/background/services/wallet/handlers/avalanche_signTransaction';
import { AvalancheSignMessageHandler } from '@src/background/services/messages/handlers/avalanche_signMessage';
import { AvalancheRenameAccountHandler } from '@src/background/services/accounts/handlers/avalanche_renameAccount';
import { AvalancheRenameWalletHandler } from '@src/background/services/secrets/handlers/avalanche_renameWallet';
import { WalletAddNetworkHandler } from '@src/background/services/network/handlers/wallet_addNetwork';
import { AvalancheDeleteAccountsHandler } from '@src/background/services/accounts/handlers/avalanche_deleteAccounts';
import { AccountsChangedCAEvents } from '@src/background/services/accounts/events/accountsChangedCAEvent';
import { RequestAccountPermissionHandler } from '@src/background/services/web3/handlers/wallet_requestAccountPermission';

/**
 * TODO: GENERATE THIS FILE AS PART OF THE BUILD PROCESS
 * There is no automativ module discovery in ts like available in java,
 * if a module is not imported ever, the DI will never know about it
 */
@registry([
  { token: 'DAppRequestHandler', useToken: AvalancheGetAccountsHandler },
  { token: 'DAppRequestHandler', useToken: EthAccountsHandler },
  {
    token: 'DAppRequestHandler',
    useToken: AvalancheGetBridgeTransactionHandler,
  },
  { token: 'DAppRequestHandler', useToken: AvalancheBridgeAsset },
  { token: 'DAppRequestHandler', useToken: AvalancheGetContactsHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheCreateContactHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheUpdateContactHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheRemoveContactHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSelectWalletHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSelectAccountHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheGetAccountPubKeyHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSendTransactionHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSignTransactionHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSignMessageHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheRenameAccountHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheDeleteAccountsHandler },
  {
    token: 'DAppRequestHandler',
    useToken: AvalancheGetAddressesInRangeHandler,
  },
  { token: 'DAppRequestHandler', useToken: PersonalEcRecoverHandler },
  { token: 'DAppRequestHandler', useToken: PersonalSignHandler },
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
])
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
])
export class DappEventEmitterRegistry {}
