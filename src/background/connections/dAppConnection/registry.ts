import { AccountsChangedEvents } from '@src/background/services/accounts/events/accountsChangedEvent';
import { AvalancheGetAccountsHandler } from '@src/background/services/accounts/handlers/avalanche_getAccounts';
import { AvalancheSelectAccountHandler } from '@src/background/services/accounts/handlers/avalanche_selectAccount';
import { EthAccountsHandler } from '@src/background/services/accounts/handlers/eth_accounts';
import { ActionCompletedEvents } from '@src/background/services/actions/events/actionCompletedEvents';
import { AvalancheBridgeAsset } from '@src/background/services/bridge/handlers/AvalancheBridgeAsset';
import { AvalancheGetBridgeTransactionHandler } from '@src/background/services/bridge/handlers/avalanche_getBridgeState';
import { AvalancheGetContactsHandler } from '@src/background/services/contacts/handlers/avalanche_getContacts';
import { LockStateChangedEvents } from '@src/background/services/lock/events/dAppUnlockStateChangedEvent';
import { PersonalEcRecoverHandler } from '@src/background/services/messages/handlers/personal_ecRecover';
import { PersonalSignHandler } from '@src/background/services/messages/handlers/signMessage';
import { ChainChangedEvents } from '@src/background/services/network/events/chainChangedEvent';
import { WalletAddEthereumChainHandler } from '@src/background/services/network/handlers/wallet_addEthereumChain';
import { WalletSwitchEthereumChainHandler } from '@src/background/services/network/handlers/wallet_switchEthereumChain';
import { WalletGetPermissionsHandler } from '@src/background/services/permissions/handlers/wallet_getPermissions';
import { WalletRequestPermissionsHandler } from '@src/background/services/permissions/handlers/wallet_requestPermissions';
import { WalletWatchAssetHandler } from '@src/background/services/settings/events/wallet_watchAsset';
import { GetIsDefaultExtensionDAppHandler } from '@src/background/services/settings/handlers/getIsDefaultExtension';
import { TransactionCompletedEvents } from '@src/background/services/transactions/events/transactionCompletedEvents';
import { EthSendTransactionHandler } from '@src/background/services/transactions/handlers/eth_sendTransaction';
import { AvalancheSelectWalletHandler } from '@src/background/services/web3/handlers/avalanche_selectWallet';
import { ConnectRequestHandler } from '@src/background/services/web3/handlers/connect';
import { MetamaskGetProviderState } from '@src/background/services/web3/handlers/metamask_getProviderState';
import { MetamaskSendDomainMetadataHandler } from '@src/background/services/web3/handlers/metamask_sendDomainMetadata';
import { registry } from 'tsyringe';

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
  { token: 'DAppRequestHandler', useToken: AvalancheSelectWalletHandler },
  { token: 'DAppRequestHandler', useToken: AvalancheSelectAccountHandler },
  { token: 'DAppRequestHandler', useToken: PersonalEcRecoverHandler },
  { token: 'DAppRequestHandler', useToken: PersonalSignHandler },
  { token: 'DAppRequestHandler', useToken: WalletAddEthereumChainHandler },
  { token: 'DAppRequestHandler', useToken: WalletSwitchEthereumChainHandler },
  { token: 'DAppRequestHandler', useToken: WalletGetPermissionsHandler },
  { token: 'DAppRequestHandler', useToken: WalletRequestPermissionsHandler },
  { token: 'DAppRequestHandler', useToken: WalletWatchAssetHandler },
  { token: 'DAppRequestHandler', useToken: GetIsDefaultExtensionDAppHandler },
  { token: 'DAppRequestHandler', useToken: EthSendTransactionHandler },
  { token: 'DAppRequestHandler', useToken: ConnectRequestHandler },
  { token: 'DAppRequestHandler', useToken: MetamaskGetProviderState },
  { token: 'DAppRequestHandler', useToken: MetamaskSendDomainMetadataHandler },
])
export class DappRequestHandlerRegistry {}

@registry([
  { token: 'DAppEventEmitter', useToken: AccountsChangedEvents },
  { token: 'DAppEventEmitter', useToken: LockStateChangedEvents },
  { token: 'DAppEventEmitter', useToken: ChainChangedEvents },
  { token: 'DAppEventEmitter', useToken: ActionCompletedEvents },
  { token: 'DAppEventEmitter', useToken: TransactionCompletedEvents },
])
export class DappEventEmitterRegistry {}
