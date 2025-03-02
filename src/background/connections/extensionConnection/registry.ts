import { CaptureAnalyticsEventHandler } from '../../services/analytics/handlers/captureAnalyticsEvent';
import { AccountsUpdatedEvents } from '@src/background/services/accounts/events/accountsUpdatedEvent';
import { AddAccountHandler } from '@src/background/services/accounts/handlers/addAccount';
import { GetAccountsHandler } from '@src/background/services/accounts/handlers/getAccounts';
import { SelectAccountHandler } from '@src/background/services/accounts/handlers/selectAccount';
import { GetActionHandler } from '@src/background/services/actions/handlers/getActions';
import { UpdateActionHandler } from '@src/background/services/actions/handlers/updateAction';
import { AnalyticsUpdatedEvents } from '@src/background/services/analytics/events/analyticsStateUpdatedEvent';
import { ClearAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/clearAnalyticsIds';
import { GetAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/getAnalyticsIds';
import { InitAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/initAnalyticsIds';
import { StoreAnalyticsIdsHandler } from '@src/background/services/analytics/handlers/storeAnalyticsIds';
import { GetBalancesHandler } from '@src/background/services/balances/handlers/getBalances';
import { GetTokenPriceHandler } from '@src/background/services/balances/handlers/getTokenPrice';
import { BridgeConfigUpdatedEvents } from '@src/background/services/bridge/events/bridgeConfigUpdateEvents';
import { BridgeStateUpdateEvents } from '@src/background/services/bridge/events/bridgeStateUpdateEvents';
import { BridgeTransferEvents } from '@src/background/services/bridge/events/bridgeTransferEvents';
import { BridgeCreateTransactionHandler } from '@src/background/services/bridge/handlers/createBridgeTransaction';
import { BridgeGetConfigHandler } from '@src/background/services/bridge/handlers/getBridgeConfig';
import { BridgeGetStateHandler } from '@src/background/services/bridge/handlers/getBridgeState';
import { BridgeRemoveTransactionHandler } from '@src/background/services/bridge/handlers/removeBridgeTransaction';
import { BridgeSetIsDevEnvHandler } from '@src/background/services/bridge/handlers/setIsDevEnv';
import { ContactsUpdatedEvents } from '@src/background/services/contacts/events/contactsUpdatedEvent';
import { CreateContactHandler } from '@src/background/services/contacts/handlers/createContact';
import { GetContactsHandler } from '@src/background/services/contacts/handlers/getContacts';
import { UpdateContactHandler } from '@src/background/services/contacts/handlers/updateContact';
import { RemoveContactHandler } from '@src/background/services/contacts/handlers/removeContact';
import { GetHistoryHandler } from '@src/background/services/history/handlers/getHistory';
import { LedgerTransportRequestEvents } from '@src/background/services/ledger/events/ledgerDeviceRequest';
import { InitLedgerTransportHandler } from '@src/background/services/ledger/handlers/initLedgerTransport';
import { LedgerResponseHandler } from '@src/background/services/ledger/handlers/ledgerResponse';
import { LockChangePasswordHandler } from '@src/background/services/lock/handlers/changeWalletPassword';
import { LockWalletHandler } from '@src/background/services/lock/handlers/lockWallet';
import { UnlockWalletHandler } from '@src/background/services/lock/handlers/unlockWalletState';
import { GetNavigationHistoryHandler } from '@src/background/services/navigationHistory/handlers/getNavigationHistory';
import { GetNavigationHistoryDataHandler } from '@src/background/services/navigationHistory/handlers/getNavigationHistoryData';
import { SetNavigationHistoryHandler } from '@src/background/services/navigationHistory/handlers/setNavigationHistory';
import { SetNavigationHistoryDataHandler } from '@src/background/services/navigationHistory/handlers/setNavigationHistoryData';
import { SaveCustomNetworkHandler } from '@src/background/services/network/handlers/saveCustomNetwork';
import { RemoveCustomNetworkHandler } from '@src/background/services/network/handlers/removeCustomNetwork';
import { UpdateDefaultNetworkHandler } from '@src/background/services/network/handlers/updateDefaultNetwork';
import { SetDevelopermodeNetworkHandler } from '@src/background/services/network/handlers/setDeveloperMode';
import { GetNetworkFeeHandler } from '@src/background/services/networkFee/handlers/getNetworkFee';
import { OnboardingUpdatedEvents } from '@src/background/services/onboarding/events/onboardingUpdatedEvent';
import { GetIsOnboardedHandler } from '@src/background/services/onboarding/handlers/getIsOnBoarded';
import { PermissionStateUpdateEvents } from '@src/background/services/permissions/events/permissionsStateUpdates';
import { PermissionsAddDomainHandler } from '@src/background/services/permissions/handlers/addPermissionsForDomain';
import { GetAllPermissionsHandler } from '@src/background/services/permissions/handlers/getAllPermissions';
import { GetPermissionsForDomainHandler } from '@src/background/services/permissions/handlers/getPermissionsForDomain';
import { SettingsUpdatedEvents } from '@src/background/services/settings/events/settingsUpdatedEvent';
import { AddCustomTokenHandler } from '@src/background/services/settings/handlers/addCustomToken';
import { GetSettingsHandler } from '@src/background/services/settings/handlers/getSettings';
import { GetTokenDataHandler } from '@src/background/services/settings/handlers/getTokenDataByAddress';
import { SetAnalyticsConsentHandler } from '@src/background/services/settings/handlers/setAnalyticsConsent';
import { UpdateShowNoBalanceHandler } from '@src/background/services/settings/handlers/updateShowTokensNoBalance';
import { UpdateThemeHandler } from '@src/background/services/settings/handlers/updateTheme';
import { ResetExtensionStateHandler } from '@src/background/services/storage/handlers/resetExtensionState';
import { GetUnencryptedMnemonicHandler } from '@src/background/services/wallet/handlers/getUnencryptedMnemonic';
import { GetWalletDetailsHandler } from '@src/background/services/wallet/handlers/getWalletDetails';
import { registry } from 'tsyringe';
import { UpdateCurrencyHandler } from '../../services/settings/handlers/updateCurrencySelection';
import { UpdateTokensVisiblityHandler } from '../../services/settings/handlers/updateTokensVisibility';
import { UpdateCollectiblesVisibilityHandler } from '../../services/settings/handlers/updateCollectiblesVisibility';
import { NetworksUpdatedEvents } from '@src/background/services/network/events/networksUpdatedEvent';
import { NetworkUpdatedEvents } from '@src/background/services/network/events/networkUpdatedEvent';
import { UpdateBalancesForNetworkHandler } from '@src/background/services/balances/handlers/updateBalancesForNetwork';
import { RemoveLedgerTransportHandler } from '@src/background/services/ledger/handlers/removeLedgerTransport';
import { GetLockStateHandler } from '@src/background/services/lock/handlers/getLockState';
import { LockStateChangedEvents } from '@src/background/services/lock/events/lockStateChangedEvent';
import { LedgerDiscoverTransportsEvents } from '@src/background/services/ledger/events/ledgerDiscoverTransports';
import { AddFavoriteNetworkHandler } from '@src/background/services/network/handlers/addFavoriteNetwork';
import { RemoveFavoriteNetworkHandler } from '@src/background/services/network/handlers/removeFavoriteNetwork';
import { GetNetworksStateHandler } from '@src/background/services/network/handlers/getNetworkState';
import { GetFeatureFlagsHandler } from '@src/background/services/featureFlags/handlers/getFeatureFlags';
import { FeatureFlagsUpdatedEvent } from '@src/background/services/featureFlags/events/featureFlagsUpdatedEvent';
import { CloseLedgerTransportHandler } from '@src/background/services/ledger/handlers/closeOpenTransporters';
import { LedgerCloseTransportEvent } from '@src/background/services/ledger/events/ledgerCloseTransport';
import { GetAvaxBalanceHandler } from '@src/background/services/balances/handlers/getAvaxBalance';
import { GetLedgerVersionWarningHandler } from '@src/background/services/ledger/handlers/getLedgerVersionWarning';
import { LedgerVersionWarningClosedHandler } from '@src/background/services/ledger/handlers/setLedgerVersionWarningClosed';
import { SetLanguageHandler } from '@src/background/services/settings/handlers/setLanguage';
import { MigrateMissingPublicKeysFromLedgerHandler } from '@src/background/services/ledger/handlers/migrateMissingPublicKeysFromLedger';
import { KeystoneRequestEvents } from '@src/background/services/keystone/events/keystoneDeviceRequest';
import { SubmitKeystoneSignature } from '@src/background/services/keystone/handlers/keystoneSubmitSignature';
import { StoreBtcWalletPolicyDetails } from '@src/background/services/wallet/handlers/storeBtcWalletPolicyDetails';
import { GetBtcWalletPolicyDetails } from '@src/background/services/wallet/handlers/getBtcWalletPolicyDetails';
import { WalletUpdatedEvents } from '@src/background/services/secrets/events/WalletUpdatedEvent';
import { GetDefiPortfolioHandler } from '@src/background/services/defi/handlers/getDefiPortfolio';
import { CurrencyRatesUpdatedEvents } from '@src/background/services/currency/events/currencyRatesUpdatedEvent';
import { GetCurrencyExchangeRatesHandler } from '@src/background/services/currency/handlers/getCurrencyExchangeRates';
import { DefiPortfolioUpdatedEvents } from '@src/background/services/defi/events/defiPortfolioUpdatedEvent';
import { WalletConnectImportAccount } from '@src/background/services/walletConnect/handlers/walletConnectImportAccount';
import { WalletConnectEvents } from '@src/background/services/walletConnect/events/walletConnectEvents';
import { GetTokensListHandler } from '@src/background/services/tokens/handlers/getTokenList';
import { EstablishRequiredSession } from '@src/background/services/walletConnect/handlers/establishRequiredSession';
import { FireblocksUpdateApiCredentialsHandler } from '@src/background/services/fireblocks/handlers/fireblocksUpdateApiCredentials';
import { SeedlessTokenEvents } from '@src/background/services/seedless/events/seedlessTokenEvents';
import { UpdateSignerTokenHandler } from '@src/background/services/seedless/handlers/updateSignerToken';
import { HasSignerTokenExpiredHandler } from '@src/background/services/seedless/handlers/hasSignerTokenExpired';
import { SeedlessMfaEvents } from '@src/background/services/seedless/events/seedlessMfaEvents';
import { SubmitMfaResponseHandler } from '@src/background/services/seedless/handlers/submitMfaResponse';
import { GetRecoveryPhraseExportStateHandler } from '@src/background/services/seedless/handlers/getRecoveryPhraseExportState';
import { InitRecoveryPhraseExportHandler } from '@src/background/services/seedless/handlers/initRecoveryPhraseExport';
import { CompleteRecoveryPhraseExportHandler } from '@src/background/services/seedless/handlers/completeRecoveryPhraseExport';
import { CancelRecoveryPhraseExportHandler } from '@src/background/services/seedless/handlers/cancelRecoveryPhraseExport';
import { UnifiedBridgeGetState } from '@src/background/services/unifiedBridge/handlers/unifiedBridgeGetState';
import { UnifiedBridgeEvents } from '@src/background/services/unifiedBridge/events/unifiedBridgeEvents';
import { GetPrivateKeyHandler } from '@src/background/services/accounts/handlers/getPrivateKey';
import { EstimateGasForBridgeTxHandler } from '@src/background/services/bridge/handlers/estimateGasForBridgeTx';
import { ImportSeedPhraseHandler } from '@src/background/services/wallet/handlers/importSeedPhrase';
import { ImportLedgerHandler } from '@src/background/services/wallet/handlers/importLedger';
import { GetRecoveryMethodsHandler } from '@src/background/services/seedless/handlers/getRecoveryMethods';
import { InitAuthenticatorChangeHandler } from '@src/background/services/seedless/handlers/initAuthenticatorChange';
import { CompleteAuthenticatorChangeHandler } from '@src/background/services/seedless/handlers/completeAuthenticatorChange';
import { ChooseMfaMethodHandler } from '@src/background/services/seedless/handlers/chooseMfaMethod';
import { RefreshNftMetadataHandler } from '@src/background/services/balances/handlers/refreshNftMetadata';
import { AddFidoDeviceHandler } from '@src/background/services/seedless/handlers/addFidoDevice';
import { RemoveFidoDeviceHandler } from '@src/background/services/seedless/handlers/removeFidoDevice';
import { RemoveTotpHandler } from '@src/background/services/seedless/handlers/removeTotp';
import { MnemonicOnboardingHandler } from '@src/background/services/onboarding/handlers/mnemonicOnboardingHandler';
import { SeedlessOnboardingHandler } from '@src/background/services/onboarding/handlers/seedlessOnboardingHandler';
import { KeystoneOnboardingHandler } from '@src/background/services/onboarding/handlers/keystoneOnboardingHandler';
import { LedgerOnboardingHandler } from '@src/background/services/onboarding/handlers/ledgerOnboardingHandler';
import { ApprovalEvents } from '@src/background/services/approvals/events/approvalEvents';
import { SetActiveNetworkHandler } from '@src/background/services/network/handlers/setActiveNetwork';
import { StartBalancesPollingHandler } from '@src/background/services/balances/handlers/startBalancesPolling';
import { StopBalancesPollingHandler } from '@src/background/services/balances/handlers/stopBalancesPolling';
import { BalancesUpdatedEvents } from '@src/background/services/balances/events/balancesUpdatedEvent';
import { UnifiedBridgeTrackTransfer } from '@src/background/services/unifiedBridge/handlers/unifiedBridgeTrackTransfer';
import { UpdateActionTxDataHandler } from '@src/background/services/actions/handlers/updateTxData';
import { GetTotalBalanceForWalletHandler } from '@src/background/services/balances/handlers/getTotalBalanceForWallet/getTotalBalanceForWallet';
import { GetGaslessChallengeHexHandler } from '@src/background/services/gasless/handlers/getGaslessChallengeHex';
import { FundTxHandler } from '@src/background/services/gasless/handlers/fundTx';
import { GaslessSendMessageEvent } from '@src/background/services/gasless/events/gaslessSendMessageEvent';
import { GetGaslessEligibilityHandler } from '@src/background/services/gasless/handlers/getGaslessEligibility';
import { FetchGaslessChallengeHandler } from '@src/background/services/gasless/handlers/fetchGaslessChallange';
import { GaslessChallangeUpdateEvent } from '@src/background/services/gasless/events/gaslessChallangeUpdateEvent';
import { SetGaslessDefaultValuesHandler } from '@src/background/services/gasless/handlers/setDefaultValues';

/**
 * TODO: GENERATE THIS FILE AS PART OF THE BUILD PROCESS
 * There is no automatic module discovery in ts like available in java,
 * if a module is not imported ever, the DI will never know about it
 */
@registry([
  { token: 'ExtensionRequestHandler', useToken: AddAccountHandler },
  { token: 'ExtensionRequestHandler', useToken: GetAccountsHandler },
  { token: 'ExtensionRequestHandler', useToken: SelectAccountHandler },
  { token: 'ExtensionRequestHandler', useToken: GetActionHandler },
  { token: 'ExtensionRequestHandler', useToken: UpdateActionHandler },
  { token: 'ExtensionRequestHandler', useToken: UpdateActionTxDataHandler },
  { token: 'ExtensionRequestHandler', useToken: ClearAnalyticsIdsHandler },
  { token: 'ExtensionRequestHandler', useToken: GetAnalyticsIdsHandler },
  { token: 'ExtensionRequestHandler', useToken: InitAnalyticsIdsHandler },
  { token: 'ExtensionRequestHandler', useToken: StoreAnalyticsIdsHandler },
  { token: 'ExtensionRequestHandler', useToken: CaptureAnalyticsEventHandler },

  {
    token: 'ExtensionRequestHandler',
    useToken: BridgeCreateTransactionHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: UpdateBalancesForNetworkHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: GetBalancesHandler },
  { token: 'ExtensionRequestHandler', useToken: BridgeGetConfigHandler },
  { token: 'ExtensionRequestHandler', useToken: BridgeGetStateHandler },
  { token: 'ExtensionRequestHandler', useToken: BridgeSetIsDevEnvHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: BridgeRemoveTransactionHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: CreateContactHandler },
  { token: 'ExtensionRequestHandler', useToken: GetContactsHandler },
  { token: 'ExtensionRequestHandler', useToken: UpdateContactHandler },
  { token: 'ExtensionRequestHandler', useToken: RemoveContactHandler },
  { token: 'ExtensionRequestHandler', useToken: InitLedgerTransportHandler },
  { token: 'ExtensionRequestHandler', useToken: RemoveLedgerTransportHandler },
  { token: 'ExtensionRequestHandler', useToken: LedgerResponseHandler },
  { token: 'ExtensionRequestHandler', useToken: LockChangePasswordHandler },
  { token: 'ExtensionRequestHandler', useToken: LockWalletHandler },
  { token: 'ExtensionRequestHandler', useToken: UnlockWalletHandler },
  { token: 'ExtensionRequestHandler', useToken: GetLockStateHandler },
  { token: 'ExtensionRequestHandler', useToken: GetNavigationHistoryHandler },
  { token: 'ExtensionRequestHandler', useToken: CloseLedgerTransportHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetNavigationHistoryDataHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: SetNavigationHistoryHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: SetNavigationHistoryDataHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: SaveCustomNetworkHandler },
  { token: 'ExtensionRequestHandler', useToken: RemoveCustomNetworkHandler },
  { token: 'ExtensionRequestHandler', useToken: UpdateDefaultNetworkHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: SetDevelopermodeNetworkHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: AddFavoriteNetworkHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: RemoveFavoriteNetworkHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: SetActiveNetworkHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetNetworksStateHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: GetNetworkFeeHandler },
  { token: 'ExtensionRequestHandler', useToken: GetIsOnboardedHandler },
  { token: 'ExtensionRequestHandler', useToken: MnemonicOnboardingHandler },
  { token: 'ExtensionRequestHandler', useToken: SeedlessOnboardingHandler },
  { token: 'ExtensionRequestHandler', useToken: KeystoneOnboardingHandler },
  { token: 'ExtensionRequestHandler', useToken: LedgerOnboardingHandler },
  { token: 'ExtensionRequestHandler', useToken: PermissionsAddDomainHandler },
  { token: 'ExtensionRequestHandler', useToken: GetAllPermissionsHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetPermissionsForDomainHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: AddCustomTokenHandler },
  { token: 'ExtensionRequestHandler', useToken: GetSettingsHandler },
  { token: 'ExtensionRequestHandler', useToken: GetTokenDataHandler },
  { token: 'ExtensionRequestHandler', useToken: GetWalletDetailsHandler },
  { token: 'ExtensionRequestHandler', useToken: GetBtcWalletPolicyDetails },
  { token: 'ExtensionRequestHandler', useToken: StoreBtcWalletPolicyDetails },
  { token: 'ExtensionRequestHandler', useToken: GetUnencryptedMnemonicHandler },
  { token: 'ExtensionRequestHandler', useToken: UpdateShowNoBalanceHandler },
  { token: 'ExtensionRequestHandler', useToken: SetAnalyticsConsentHandler },
  { token: 'ExtensionRequestHandler', useToken: UpdateCurrencyHandler },
  { token: 'ExtensionRequestHandler', useToken: UpdateThemeHandler },
  { token: 'ExtensionRequestHandler', useToken: UpdateTokensVisiblityHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: UpdateCollectiblesVisibilityHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: ResetExtensionStateHandler },
  { token: 'ExtensionRequestHandler', useToken: GetTokenPriceHandler },
  { token: 'ExtensionRequestHandler', useToken: GetHistoryHandler },
  { token: 'ExtensionRequestHandler', useToken: GetFeatureFlagsHandler },
  { token: 'ExtensionRequestHandler', useToken: GetAvaxBalanceHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetLedgerVersionWarningHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: LedgerVersionWarningClosedHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: SetLanguageHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: MigrateMissingPublicKeysFromLedgerHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: SubmitKeystoneSignature },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetDefiPortfolioHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetCurrencyExchangeRatesHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: WalletConnectImportAccount,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetTokensListHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: EstablishRequiredSession,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: FireblocksUpdateApiCredentialsHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: UpdateSignerTokenHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: HasSignerTokenExpiredHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: SubmitMfaResponseHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetRecoveryPhraseExportStateHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: InitRecoveryPhraseExportHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: CompleteRecoveryPhraseExportHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: CancelRecoveryPhraseExportHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: UnifiedBridgeTrackTransfer,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: UnifiedBridgeGetState,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetPrivateKeyHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: EstimateGasForBridgeTxHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: ImportSeedPhraseHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: ImportLedgerHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetRecoveryMethodsHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: InitAuthenticatorChangeHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: CompleteAuthenticatorChangeHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: ChooseMfaMethodHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: AddFidoDeviceHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: RemoveFidoDeviceHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: RemoveTotpHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: RefreshNftMetadataHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: StartBalancesPollingHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: StopBalancesPollingHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetTotalBalanceForWalletHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetGaslessChallengeHexHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: FetchGaslessChallengeHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: FundTxHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetGaslessEligibilityHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: SetGaslessDefaultValuesHandler,
  },
])
export class ExtensionRequestHandlerRegistry {}

@registry([
  { token: 'ExtensionEventEmitter', useToken: AccountsUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: AnalyticsUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: BalancesUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: BridgeConfigUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: OnboardingUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: NetworkUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: NetworksUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: ContactsUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: BridgeTransferEvents },
  { token: 'ExtensionEventEmitter', useToken: BridgeStateUpdateEvents },
  { token: 'ExtensionEventEmitter', useToken: SettingsUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: PermissionStateUpdateEvents },
  { token: 'ExtensionEventEmitter', useToken: LedgerTransportRequestEvents },
  { token: 'ExtensionEventEmitter', useToken: KeystoneRequestEvents },
  { token: 'ExtensionEventEmitter', useToken: LedgerDiscoverTransportsEvents },
  { token: 'ExtensionEventEmitter', useToken: LockStateChangedEvents },
  { token: 'ExtensionEventEmitter', useToken: FeatureFlagsUpdatedEvent },
  { token: 'ExtensionEventEmitter', useToken: LedgerCloseTransportEvent },
  { token: 'ExtensionEventEmitter', useToken: WalletUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: CurrencyRatesUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: DefiPortfolioUpdatedEvents },
  { token: 'ExtensionEventEmitter', useToken: WalletConnectEvents },
  { token: 'ExtensionEventEmitter', useToken: SeedlessTokenEvents },
  { token: 'ExtensionEventEmitter', useToken: SeedlessMfaEvents },
  { token: 'ExtensionEventEmitter', useToken: UnifiedBridgeEvents },
  { token: 'ExtensionEventEmitter', useToken: ApprovalEvents },
  { token: 'ExtensionEventEmitter', useToken: GaslessSendMessageEvent },
  { token: 'ExtensionEventEmitter', useToken: GaslessChallangeUpdateEvent },
])
export class ExtensionEventEmitterRegistry {}
