import { registry } from 'tsyringe';
import { AccountsUpdatedEvents } from '../../services/accounts/events/accountsUpdatedEvent';
import { AddAccountHandler } from '../../services/accounts/handlers/addAccount';
import { GetAccountsHandler } from '../../services/accounts/handlers/getAccounts';
import { GetPrivateKeyHandler } from '../../services/accounts/handlers/getPrivateKey';
import { SelectAccountHandler } from '../../services/accounts/handlers/selectAccount';
import { GetActionHandler } from '../../services/actions/handlers/getActions';
import { UpdateActionHandler } from '../../services/actions/handlers/updateAction';
import { UpdateActionTxDataHandler } from '../../services/actions/handlers/updateTxData';
import { AnalyticsUpdatedEvents } from '../../services/analytics/events/analyticsStateUpdatedEvent';
import { CaptureAnalyticsEventHandler } from '../../services/analytics/handlers/captureAnalyticsEvent';
import { ClearAnalyticsIdsHandler } from '../../services/analytics/handlers/clearAnalyticsIds';
import { GetAnalyticsIdsHandler } from '../../services/analytics/handlers/getAnalyticsIds';
import { InitAnalyticsIdsHandler } from '../../services/analytics/handlers/initAnalyticsIds';
import { StoreAnalyticsIdsHandler } from '../../services/analytics/handlers/storeAnalyticsIds';
import { ApprovalEvents } from '../../services/approvals/events/approvalEvents';
import { BalancesUpdatedEvents } from '../../services/balances/events/balancesUpdatedEvent';
import { TransactionStatusEvents } from '../../services/transactions/events/transactionStatusEvents';
import { GetBalancesHandler } from '../../services/balances/handlers/getBalances';
import { GetNativeBalanceHandler } from '../../services/balances/handlers/getNativeBalance';
import { GetTokenPriceHandler } from '../../services/balances/handlers/getTokenPrice';
import { GetTokenPriceByAddressHandler } from '../../services/balances/handlers/getTokenPriceByAddress';
import { GetTotalBalanceForWalletHandler } from '../../services/balances/handlers/getTotalBalanceForWallet/getTotalBalanceForWallet';
import { RefreshNftMetadataHandler } from '../../services/balances/handlers/refreshNftMetadata';
import { StartBalancesPollingHandler } from '../../services/balances/handlers/startBalancesPolling';
import { StopBalancesPollingHandler } from '../../services/balances/handlers/stopBalancesPolling';
import { UpdateBalancesForNetworkHandler } from '../../services/balances/handlers/updateBalancesForNetwork';
import { BridgeConfigUpdatedEvents } from '../../services/bridge/events/bridgeConfigUpdateEvents';
import { BridgeStateUpdateEvents } from '../../services/bridge/events/bridgeStateUpdateEvents';
import { BridgeTransferEvents } from '../../services/bridge/events/bridgeTransferEvents';
import { BridgeCreateTransactionHandler } from '../../services/bridge/handlers/createBridgeTransaction';
import { EstimateGasForBridgeTxHandler } from '../../services/bridge/handlers/estimateGasForBridgeTx';
import { BridgeGetConfigHandler } from '../../services/bridge/handlers/getBridgeConfig';
import { BridgeGetStateHandler } from '../../services/bridge/handlers/getBridgeState';
import { BridgeRemoveTransactionHandler } from '../../services/bridge/handlers/removeBridgeTransaction';
import { BridgeSetIsDevEnvHandler } from '../../services/bridge/handlers/setIsDevEnv';
import { ContactsUpdatedEvents } from '../../services/contacts/events/contactsUpdatedEvent';
import { CreateContactHandler } from '../../services/contacts/handlers/createContact';
import { GetContactsHandler } from '../../services/contacts/handlers/getContacts';
import { RemoveContactHandler } from '../../services/contacts/handlers/removeContact';
import { UpdateContactHandler } from '../../services/contacts/handlers/updateContact';
import { CurrencyRatesUpdatedEvents } from '../../services/currency/events/currencyRatesUpdatedEvent';
import { GetCurrencyExchangeRatesHandler } from '../../services/currency/handlers/getCurrencyExchangeRates';
import { DefiPortfolioUpdatedEvents } from '../../services/defi/events/defiPortfolioUpdatedEvent';
import { GetDefiPortfolioHandler } from '../../services/defi/handlers/getDefiPortfolio';
import { FeatureFlagsUpdatedEvent } from '../../services/featureFlags/events/featureFlagsUpdatedEvent';
import { GetFeatureFlagsHandler } from '../../services/featureFlags/handlers/getFeatureFlags';
import { FirebaseSendMessageHandler } from '../../services/firebase/handlers/sendMessage';
import { FirebaseSetModelHandler } from '../../services/firebase/handlers/setModel';
import { FireblocksUpdateApiCredentialsHandler } from '../../services/fireblocks/handlers/fireblocksUpdateApiCredentials';
import { GaslessChallangeUpdateEvent } from '../../services/gasless/events/gaslessChallangeUpdateEvent';
import { FetchAndSolveChallengeHandler } from '../../services/gasless/handlers/fetchAndSolveChallenge';
import { FundTxHandler } from '../../services/gasless/handlers/fundTx';
import { GetGaslessEligibilityHandler } from '../../services/gasless/handlers/getGaslessEligibility';
import { SetDefaultStateValuesHandler } from '../../services/gasless/handlers/setDefaultStateValues';
import { GetHistoryHandler } from '../../services/history/handlers/getHistory';
import { KeystoneRequestEvents } from '../../services/keystone/events/keystoneDeviceRequest';
import { SubmitKeystoneSignature } from '../../services/keystone/handlers/keystoneSubmitSignature';
import { LedgerCloseTransportEvent } from '../../services/ledger/events/ledgerCloseTransport';
import { LedgerTransportRequestEvents } from '../../services/ledger/events/ledgerDeviceRequest';
import { LedgerDiscoverTransportsEvents } from '../../services/ledger/events/ledgerDiscoverTransports';
import { CloseLedgerTransportHandler } from '../../services/ledger/handlers/closeOpenTransporters';
import { GetLedgerVersionWarningHandler } from '../../services/ledger/handlers/getLedgerVersionWarning';
import { InitLedgerTransportHandler } from '../../services/ledger/handlers/initLedgerTransport';
import { LedgerResponseHandler } from '../../services/ledger/handlers/ledgerResponse';
import { MigrateMissingPublicKeysFromLedgerHandler } from '../../services/ledger/handlers/migrateMissingPublicKeysFromLedger';
import { RemoveLedgerTransportHandler } from '../../services/ledger/handlers/removeLedgerTransport';
import { LedgerVersionWarningClosedHandler } from '../../services/ledger/handlers/setLedgerVersionWarningClosed';
import { LockStateChangedEvents } from '../../services/lock/events/lockStateChangedEvent';
import { LockChangePasswordHandler } from '../../services/lock/handlers/changeWalletPassword';
import { GetLockStateHandler } from '../../services/lock/handlers/getLockState';
import { LockWalletHandler } from '../../services/lock/handlers/lockWallet';
import { UnlockWalletHandler } from '../../services/lock/handlers/unlockWalletState';
import { GetNavigationHistoryHandler } from '../../services/navigationHistory/handlers/getNavigationHistory';
import { GetNavigationHistoryDataHandler } from '../../services/navigationHistory/handlers/getNavigationHistoryData';
import { SetNavigationHistoryHandler } from '../../services/navigationHistory/handlers/setNavigationHistory';
import { SetNavigationHistoryDataHandler } from '../../services/navigationHistory/handlers/setNavigationHistoryData';
import { NetworksUpdatedEvents } from '../../services/network/events/networksUpdatedEvent';
import { NetworkUpdatedEvents } from '../../services/network/events/networkUpdatedEvent';
import { AddFavoriteNetworkHandler } from '../../services/network/handlers/addFavoriteNetwork';
import { GetNetworksStateHandler } from '../../services/network/handlers/getNetworkState';
import { RemoveCustomNetworkHandler } from '../../services/network/handlers/removeCustomNetwork';
import { RemoveFavoriteNetworkHandler } from '../../services/network/handlers/removeFavoriteNetwork';
import { SaveCustomNetworkHandler } from '../../services/network/handlers/saveCustomNetwork';
import { SetActiveNetworkHandler } from '../../services/network/handlers/setActiveNetwork';
import { SetDevelopermodeNetworkHandler } from '../../services/network/handlers/setDeveloperMode';
import { UpdateDefaultNetworkHandler } from '../../services/network/handlers/updateDefaultNetwork';
import { GetNetworkFeeHandler } from '../../services/networkFee/handlers/getNetworkFee';
import { OnboardingUpdatedEvents } from '../../services/onboarding/events/onboardingUpdatedEvent';
import { GetIsOnboardedHandler } from '../../services/onboarding/handlers/getIsOnBoarded';
import { OpenExtensionPopupWindowHandler } from '../../services/onboarding/handlers/openExtensionPopupWindow';
import { KeystoneOnboardingHandler } from '../../services/onboarding/handlers/keystoneOnboardingHandler';
import { LedgerOnboardingHandler } from '../../services/onboarding/handlers/ledgerOnboardingHandler';
import { MnemonicOnboardingHandler } from '../../services/onboarding/handlers/mnemonicOnboardingHandler';
import { SeedlessOnboardingHandler } from '../../services/onboarding/handlers/seedlessOnboardingHandler';
import { PermissionStateUpdateEvents } from '../../services/permissions/events/permissionsStateUpdates';
import { GetAllPermissionsHandler } from '../../services/permissions/handlers/getAllPermissions';
import { GetPermissionsForDomainHandler } from '../../services/permissions/handlers/getPermissionsForDomain';
import { RevokeAddressPermissionsForDomainHandler } from '../../services/permissions/handlers/revokeAddressPermissionsForDomain';
import { WalletUpdatedEvents } from '../../services/secrets/events/WalletUpdatedEvent';
import { SeedlessMfaEvents } from '../../services/seedless/events/seedlessMfaEvents';
import { SeedlessTokenEvents } from '../../services/seedless/events/seedlessTokenEvents';
import { AddFidoDeviceHandler } from '../../services/seedless/handlers/addFidoDevice';
import { CancelRecoveryPhraseExportHandler } from '../../services/seedless/handlers/cancelRecoveryPhraseExport';
import { ChooseMfaMethodHandler } from '../../services/seedless/handlers/chooseMfaMethod';
import { CompleteAuthenticatorChangeHandler } from '../../services/seedless/handlers/completeAuthenticatorChange';
import { CompleteRecoveryPhraseExportHandler } from '../../services/seedless/handlers/completeRecoveryPhraseExport';
import { GetRecoveryMethodsHandler } from '../../services/seedless/handlers/getRecoveryMethods';
import { GetRecoveryPhraseExportStateHandler } from '../../services/seedless/handlers/getRecoveryPhraseExportState';
import { HasSignerTokenExpiredHandler } from '../../services/seedless/handlers/hasSignerTokenExpired';
import { InitAuthenticatorChangeHandler } from '../../services/seedless/handlers/initAuthenticatorChange';
import { InitRecoveryPhraseExportHandler } from '../../services/seedless/handlers/initRecoveryPhraseExport';
import { RemoveFidoDeviceHandler } from '../../services/seedless/handlers/removeFidoDevice';
import { RemoveTotpHandler } from '../../services/seedless/handlers/removeTotp';
import { SubmitMfaResponseHandler } from '../../services/seedless/handlers/submitMfaResponse';
import { UpdateSignerTokenHandler } from '../../services/seedless/handlers/updateSignerToken';
import { SettingsUpdatedEvents } from '../../services/settings/events/settingsUpdatedEvent';
import { AddCustomTokenHandler } from '../../services/settings/handlers/addCustomToken';
import { GetSettingsHandler } from '../../services/settings/handlers/getSettings';
import { GetTokenDataHandler } from '../../services/settings/handlers/getTokenDataByAddress';
import { SetAnalyticsConsentHandler } from '../../services/settings/handlers/setAnalyticsConsent';
import { SetCoreAssistantHandler } from '../../services/settings/handlers/setCoreAssistant';
import { SetLanguageHandler } from '../../services/settings/handlers/setLanguage';
import { UpdateCollectiblesVisibilityHandler } from '../../services/settings/handlers/updateCollectiblesVisibility';
import { UpdateCurrencyHandler } from '../../services/settings/handlers/updateCurrencySelection';
import { UpdateShowNoBalanceHandler } from '../../services/settings/handlers/updateShowTokensNoBalance';
import { UpdateThemeHandler } from '../../services/settings/handlers/updateTheme';
import { UpdateTokensVisiblityHandler } from '../../services/settings/handlers/updateTokensVisibility';
import { ResetExtensionStateHandler } from '../../services/storage/handlers/resetExtensionState';
import { GetTokensListHandler } from '../../services/tokens/handlers/getTokenList';
import { UnifiedBridgeEvents } from '../../services/unifiedBridge/events/unifiedBridgeEvents';
import { UnifiedBridgeGetState } from '../../services/unifiedBridge/handlers/unifiedBridgeGetState';
import { UnifiedBridgeTrackTransfer } from '../../services/unifiedBridge/handlers/unifiedBridgeTrackTransfer';
import { CheckIfWalletExists } from '~/services/wallet/handlers/checkIfWalletExists';
import { GetBtcWalletPolicyDetails } from '../../services/wallet/handlers/getBtcWalletPolicyDetails';
import { GetUnencryptedMnemonicHandler } from '../../services/wallet/handlers/getUnencryptedMnemonic';
import { GetWalletDetailsHandler } from '../../services/wallet/handlers/getWalletDetails';
import { ImportLedgerHandler } from '../../services/wallet/handlers/importLedger';
import { ImportLedgerHandlerNew } from '~/services/wallet/handlers/importLedgerNew';
import { ImportSeedPhraseHandler } from '../../services/wallet/handlers/importSeedPhrase';
import { StoreBtcWalletPolicyDetails } from '../../services/wallet/handlers/storeBtcWalletPolicyDetails';
import { WalletConnectEvents } from '../../services/walletConnect/events/walletConnectEvents';
import { EstablishRequiredSession } from '../../services/walletConnect/handlers/establishRequiredSession';
import { WalletConnectImportAccount } from '../../services/walletConnect/handlers/walletConnectImportAccount';
import { MigrateMissingPublicKeysFromKeystoneHandler } from '../../services/keystone/handlers/migrateMissingKeysFromKeystone';

import { KeystoneOnboardingHandlerNew } from '~/services/onboarding/handlers/keystoneOnboardingHandlerNew';
import { LedgerOnboardingHandlerNew } from '~/services/onboarding/handlers/ledgerOnboardingHandlerNew';
import { SetPreferredViewHandler } from '~/services/settings/handlers/setPreferredView';
import { SubscriptionsChangedEvents } from '../../services/notifications/events/subscriptionsChangedEvent';
import { GetNotificationSubscriptions } from '../../services/notifications/handlers/getSubscriptions';
import { SubscribeToNotification } from '../../services/notifications/handlers/subscribe';
import { UnsubscribeFromNotification } from '../../services/notifications/handlers/unsubscribe';
import { AppendSolanaPublicKeysHandler } from '../../services/secrets/handlers/appendSolanaPublicKeys';
import { DeriveMissingKeysHandler } from '../../services/seedless/handlers/deriveMissingKeys';
import { SetPrivacyModeHandler } from '~/services/settings/handlers/setPrivacyMode';
import { SetShowTrendingTokensHandler } from '~/services/settings/handlers/setShowTrendingTokens';
import { EnableNetworkHandler } from '~/services/network/handlers/enableNetwork';
import { DisableNetworkHandler } from '~/services/network/handlers/disableNetwork';
import { GetTrendingTokensHandler } from '~/services/trendingTokens/handlers/getTrendingTokens';
import { GetXPAddressesForAccountHandler } from '../../services/accounts/handlers/getXPAddressesForAccountIndex';
import { GetTotalAtomicFundsForAccountHandler } from '~/services/balances/handlers/getTotalAtomicFundsForAccount';
import { NavigationRequestEvents } from '~/services/navigationHistory/events/navigationRequestEvents';
import { RequestNavigationHandler } from '~/services/navigationHistory/handlers/requestNavigation';

/**
 * TODO: GENERATE THIS FILE AS PART OF THE BUILD PROCESS
 * There is no automatic module discovery in ts like available in java,
 * if a module is not imported ever, the DI will never know about it
 */
@registry([
  { token: 'ExtensionRequestHandler', useToken: AddAccountHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetXPAddressesForAccountHandler,
  },
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
  { token: 'ExtensionRequestHandler', useToken: RequestNavigationHandler },
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
    useToken: EnableNetworkHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: DisableNetworkHandler,
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
  {
    token: 'ExtensionRequestHandler',
    useToken: OpenExtensionPopupWindowHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: MnemonicOnboardingHandler },
  { token: 'ExtensionRequestHandler', useToken: SeedlessOnboardingHandler },
  { token: 'ExtensionRequestHandler', useToken: KeystoneOnboardingHandler },
  { token: 'ExtensionRequestHandler', useToken: LedgerOnboardingHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: RevokeAddressPermissionsForDomainHandler,
  },
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
  { token: 'ExtensionRequestHandler', useToken: GetTokenPriceByAddressHandler },
  { token: 'ExtensionRequestHandler', useToken: GetHistoryHandler },
  { token: 'ExtensionRequestHandler', useToken: GetFeatureFlagsHandler },
  { token: 'ExtensionRequestHandler', useToken: GetNativeBalanceHandler },
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
    useToken: FetchAndSolveChallengeHandler,
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
    useToken: SetDefaultStateValuesHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: SetCoreAssistantHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: FirebaseSetModelHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: FirebaseSendMessageHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: AppendSolanaPublicKeysHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: DeriveMissingKeysHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: SubscribeToNotification,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: UnsubscribeFromNotification,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetNotificationSubscriptions,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: LedgerOnboardingHandlerNew,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: KeystoneOnboardingHandlerNew,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: SetPreferredViewHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: SetPrivacyModeHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: SetShowTrendingTokensHandler,
  },
  { token: 'ExtensionRequestHandler', useToken: ImportLedgerHandlerNew },
  { token: 'ExtensionRequestHandler', useToken: CheckIfWalletExists },
  { token: 'ExtensionRequestHandler', useToken: GetTrendingTokensHandler },
  {
    token: 'ExtensionRequestHandler',
    useToken: MigrateMissingPublicKeysFromKeystoneHandler,
  },
  {
    token: 'ExtensionRequestHandler',
    useToken: GetTotalAtomicFundsForAccountHandler,
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
  { token: 'ExtensionEventEmitter', useToken: GaslessChallangeUpdateEvent },
  { token: 'ExtensionEventEmitter', useToken: SubscriptionsChangedEvents },
  { token: 'ExtensionEventEmitter', useToken: NavigationRequestEvents },
  { token: 'ExtensionEventEmitter', useToken: TransactionStatusEvents },
])
export class ExtensionEventEmitterRegistry {}
