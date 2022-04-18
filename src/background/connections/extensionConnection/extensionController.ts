import { merge, tap } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '../models';
import { UpdateActionByIdRequest } from '../../services/actions/updateAction';
import { GetMessageByIdRequest } from '../../services/actions/getActions';
import { networkUpdateEvents } from '../../services/network/events/networkUpdatedEvent';
import { GetNetworkRequest } from '../../services/network/handlers/getSelectedNetwork';
import { SetNetworkRequest } from '../../services/network/handlers/setSelectedNetwork';
import { onboardingUpdatedEvent } from '../../services/onboarding/events/onboardingUpdatedEvent';
import { GetOnboardingStateRequest } from '../../services/onboarding/handlers/getIsOnBoarded';
import { OnboardingSubmitRequest } from '../../services/onboarding/handlers/submitOnboarding';
import { AddPermissionsForDomainRequest } from '../../services/permissions/handlers/addPermissionsForDomain';
import { GetAccountsForPermissionsRequest } from '../../services/permissions/handlers/getAccountsForPermissions';
import { GetPermissionsForDomainRequest } from '../../services/permissions/handlers/getPermissionsForDomain';
import { GetAllPermissionsRequest } from '../../services/permissions/handlers/getAllPermissions';
import { SettingsLockWalletStateRequest } from '../../services/settings/handlers/lockWallet';
import { gasPriceTransactionUpdate } from '../../services/transactions/events/gasPriceTransactionUpdate';
import { transactionFinalizedUpdate } from '../../services/transactions/events/transactionFinalizedUpdate';
import { GetTransactionByIdRequest } from '../../services/transactions/handlers/getTransaction';
import { UpdateTransactionByIdRequest } from '../../services/transactions/handlers/updateTransaction';
import { walletUpdateEvents } from '../../services/wallet/events/walletStateUpdates';
import { GetWalletStateRequest } from '../../services/wallet/handlers/initWalletState';
import { UnlockWalletStateRequest } from '../../services/wallet/handlers/unlockWalletState';
import { eventLog, requestLog, responseLog } from '../../../utils/logging';
import { ValidateSendAvaxStateRequest } from '@src/background/services/send/sendAvax/handlers/validateSendAvaxState';
import { ResetSendAvaxStateRequest } from '@src/background/services/send/sendAvax/handlers/resetSendAvaxState';
import { SubmitSendAvaxStateRequest } from '@src/background/services/send/sendAvax/handlers/submitSendAvaxState';
import { ResetSendErc20StateRequest } from '@src/background/services/send/sendErc20/handlers/resetSendErc20State';
import { ValidateSendErc20StateRequest } from '@src/background/services/send/sendErc20/handlers/validateSendErc20State';
import { SubmitSendErc20StateRequest } from '@src/background/services/send/sendErc20/handlers/submitSendErc20State';
import { GetSettingsStateRequest } from '@src/background/services/settings/handlers/getSettings';
import { GetContactsStateRequest } from '@src/background/services/contacts/handlers/getContacts';
import { CreateContactStateRequest } from '@src/background/services/contacts/handlers/createContact';
import { RemoveContactStateRequest } from '@src/background/services/contacts/handlers/removeContact';
import { settingsUpdatedEvent } from '@src/background/services/settings/events/settingsUpdatedEvent';
import { bridgeTransactionsUpdatedEvent } from '@src/background/services/bridge/events/bridgeTransactionsUpdateEvents';
import { SettingsUpdateCurrencySelectionRequest } from '@src/background/services/settings/handlers/updateCurrencySelection';
import { SettingsUpdateShowTokensWithBalanceRequest } from '@src/background/services/settings/handlers/updateShowTokensNoBalance';
import { SettingsUpdateTokensVisibility } from '@src/background/services/settings/handlers/updateTokensVisibility';
import { SettingsAddCustomTokenRequest } from '@src/background/services/settings/handlers/addCustomToken';
import { SettingsGetTokenDataRequest } from '@src/background/services/settings/handlers/getTokenDataByAddress';
import { ChangeWalletPasswordRequest } from '@src/background/services/wallet/handlers/changeWalletPassword';
import { GetUnencryptedMnemonicRequest } from '@src/background/services/wallet/handlers/getUnencryptedMnemonic';
import { sendTxDetailsEvent } from '@src/background/services/send/events/sendTxDetailsEvent';
import { accountsUpdateEvents } from '@src/background/services/accounts/events/accountsUpdatedEvent';
import { GetBridgeConfigRequest } from '@src/background/services/bridge/handlers/getBridgeConfig';
import { GetEthereumBalanceRequest } from '@src/background/services/bridge/handlers/getEthereumBalance';
import { GetEthereumBalancesRequest } from '@src/background/services/bridge/handlers/getEthereumBalances';
import { TransferAssetRequest } from '@src/background/services/bridge/handlers/transferAsset';
import { CreateFavoriteRequest } from '@src/background/services/favorites/handlers/createFavorite';
import { GetFavoritesRequest } from '@src/background/services/favorites/handlers/getFavorites';
import { RemoveFavoriteRequest } from '@src/background/services/favorites/handlers/removeFavorite';
import { SettingsUpdateThemeRequest } from '@src/background/services/settings/handlers/updateTheme';
import { GetAccountsRequest } from '@src/background/services/accounts/handlers/getAccounts';
import { SelectAccountRequest } from '@src/background/services/accounts/handlers/selectAccount';
import { RenameAccountRequest } from '@src/background/services/accounts/handlers/renameAccount';
import { AddAccountRequest } from '@src/background/services/accounts/handlers/addAccount';
import { GetSwapRateRequest } from '@src/background/services/swap/handlers/getSwapRate';
import { PerformSwapRequest } from '@src/background/services/swap/handlers/performSwap';
import { contactsUpdatedEvent } from '@src/background/services/contacts/events/contactsUpdatedEvent';
import { gasPriceSwapUpdate } from '@src/background/services/swap/events/gasPriceSwapUpdate';
import { GetGasRequest } from '@src/background/services/gas/handlers/getGas';
import { GetPublicKeyRequest } from '@src/background/services/ledger/handlers/getPublicKey';
import { InitLedgerTransportRequest } from '@src/background/services/ledger/handlers/initLedgerTransport';
import { SettingsGetIsDefaultExtensionRequest } from '@src/background/services/settings/handlers/getIsDefaultExtension';
import { SettingsSetDefaultExtensionRequest } from '@src/background/services/settings/handlers/setAsDefaultExtension';
import { permissionsUpdateEvents } from '@src/background/services/permissions/events/permissionsStateUpdates';

import { InitialWalletOpenRequest } from '@src/background/services/onboarding/handlers/updateInitialOpen';
import { GetBridgeTransactionsStateRequest } from '@src/background/services/bridge/handlers/getBridgeTransactions';
import { GetBtcBalancesRequest } from '@src/background/services/bridge/handlers/getBtcBalances';
import { CreateBridgeTransactionStateRequest } from '@src/background/services/bridge/handlers/createBridgeTransaction';
import { RemoveBridgeTransactionStateRequest } from '@src/background/services/bridge/handlers/removeBridgeTransaction';
import { bridgeConfigUpdateEvents } from '@src/background/services/bridge/events/bridgeConfigUpdateEvents';
import { bridgeTransferEvent } from '@src/background/services/bridge/events/bridgeTransferEvents';
import { SignAndIssueBtcTxRequest } from '@src/background/services/bridge/handlers/signAndIssueBtcTx';

import { GetNavigationHistoryDataStateRequest } from '@src/background/services/navigationHistory/handlers/getNavigationHistoryData';
import { SetNavigationHistoryDataStateRequest } from '@src/background/services/navigationHistory/handlers/setNavigationHistoryData';
import { GetNavigationHistoryStateRequest } from '@src/background/services/navigationHistory/handlers/getNavigationHistory';
import { SetNavigationHistoryStateRequest } from '@src/background/services/navigationHistory/handlers/setNavigationHistory';

import { SubmitSendNFTStateRequest } from '@src/background/services/send/sendNft/handlers/submitSendNftState';
import { ValidateSendNFTStateRequest } from '@src/background/services/send/sendNft/handlers/validateSendNftState';
import { ResetSendNftStateRequest } from '@src/background/services/send/sendNft/handlers/resetSendNftState';

import { SettingsSetAnalyticsConsentRequest } from '@src/background/services/settings/handlers/setAnalyticsConsent';

import { ledgerDeviceRequest } from '@src/background/services/ledger/events/ledgerDeviceRequest';
import { LedgerResponseRequest } from '@src/background/services/ledger/handlers/ledgerResponse';
import { isDevelopment } from '@src/utils/isDevelopment';
import { analyticsStateUpdatedEvent } from '@src/background/services/analytics/events/analyticsStateUpdatedEvent';
import { AnalyticsStoreIdsRequest } from '@src/background/services/analytics/handlers/storeAnalyticsIds';
import { AnalyticsInitIdsRequest } from '@src/background/services/analytics/handlers/initAnalyticsIds';
import { AnalyticsClearIdsRequest } from '@src/background/services/analytics/handlers/clearAnalyticsIds';
import { AnalyticsGetIdsRequest } from '@src/background/services/analytics/handlers/getAnalyticsIds';

const extensionRequestHandlerMap = new Map<
  ExtensionRequest,
  ConnectionRequestHandler
>([
  GetMessageByIdRequest,
  UpdateActionByIdRequest,

  GetOnboardingStateRequest,
  OnboardingSubmitRequest,

  GetNetworkRequest,
  SetNetworkRequest,

  GetAccountsRequest,
  SelectAccountRequest,
  RenameAccountRequest,
  AddAccountRequest,

  GetBridgeConfigRequest,
  GetEthereumBalanceRequest,
  GetEthereumBalancesRequest,
  TransferAssetRequest,
  SignAndIssueBtcTxRequest,
  GetBtcBalancesRequest,
  GetBridgeTransactionsStateRequest,
  CreateBridgeTransactionStateRequest,
  RemoveBridgeTransactionStateRequest,

  GetWalletStateRequest,
  UnlockWalletStateRequest,
  ChangeWalletPasswordRequest,
  GetUnencryptedMnemonicRequest,

  AddPermissionsForDomainRequest,
  GetAllPermissionsRequest,
  GetPermissionsForDomainRequest,
  GetAccountsForPermissionsRequest,

  UpdateTransactionByIdRequest,
  GetTransactionByIdRequest,

  ValidateSendAvaxStateRequest,
  ResetSendAvaxStateRequest,
  SubmitSendAvaxStateRequest,

  ResetSendErc20StateRequest,
  ValidateSendErc20StateRequest,
  SubmitSendErc20StateRequest,

  SubmitSendNFTStateRequest,
  ResetSendNftStateRequest,
  ValidateSendNFTStateRequest,

  GetSettingsStateRequest,
  SettingsUpdateCurrencySelectionRequest,
  SettingsUpdateShowTokensWithBalanceRequest,
  SettingsUpdateTokensVisibility,
  SettingsLockWalletStateRequest,
  SettingsUpdateThemeRequest,
  SettingsAddCustomTokenRequest,
  SettingsGetTokenDataRequest,
  SettingsGetIsDefaultExtensionRequest,
  SettingsSetDefaultExtensionRequest,
  SettingsSetAnalyticsConsentRequest,

  InitialWalletOpenRequest,

  GetContactsStateRequest,
  CreateContactStateRequest,
  RemoveContactStateRequest,

  CreateFavoriteRequest,
  GetFavoritesRequest,
  RemoveFavoriteRequest,

  GetSwapRateRequest,
  PerformSwapRequest,

  GetGasRequest,

  InitLedgerTransportRequest,
  GetPublicKeyRequest,
  LedgerResponseRequest,

  GetNavigationHistoryDataStateRequest,
  SetNavigationHistoryDataStateRequest,
  GetNavigationHistoryStateRequest,
  SetNavigationHistoryStateRequest,

  AnalyticsInitIdsRequest,
  AnalyticsStoreIdsRequest,
  AnalyticsClearIdsRequest,
  AnalyticsGetIdsRequest,
]);

export function extensionMessageHandler(connection: Runtime.Port) {
  function respondToRequest(response) {
    if (isDevelopment()) {
      responseLog(`extension reponse (${response.method})`, response);
    }
    connection.postMessage(response);
  }

  return (message: ExtensionConnectionMessage) => {
    if (isDevelopment()) {
      requestLog(`extension request (${message.method})`, message);
    }

    const handler = extensionRequestHandlerMap.get(
      message.method as ExtensionRequest
    );

    if (!handler) {
      return respondToRequest({
        ...message,
        error: new Error('no handler for this request found'),
      });
    }

    handler(message).then(respondToRequest);
  };
}

export function extensionEventsHandler(connection: Runtime.Port) {
  return merge(
    onboardingUpdatedEvent(),
    networkUpdateEvents(),
    accountsUpdateEvents(),
    bridgeConfigUpdateEvents(),
    bridgeTransferEvent(),
    walletUpdateEvents,
    permissionsUpdateEvents,
    gasPriceTransactionUpdate(),
    transactionFinalizedUpdate(),
    settingsUpdatedEvent(),
    bridgeTransactionsUpdatedEvent(),
    contactsUpdatedEvent(),
    sendTxDetailsEvent(),
    gasPriceSwapUpdate(),
    ledgerDeviceRequest(),
    analyticsStateUpdatedEvent()
  ).pipe(
    tap((evt) => {
      eventLog(`extension event (${evt.name})`, evt);
      connection.postMessage(evt);
    })
  );
}
