const ExportRecoveryPhrasePrefix = 'Seedless.ExportRecoveryPhrase';

export enum SeedlessExportAnalytics {
  MenuItemClicked = `${ExportRecoveryPhrasePrefix}.MenuItemClicked`,
  Resigned = `${ExportRecoveryPhrasePrefix}.Resigned`,

  PopupOpened = `${ExportRecoveryPhrasePrefix}.PopupOpened`,

  InitiationStarted = `${ExportRecoveryPhrasePrefix}.InitiationStarted`,
  InitiationSucceeded = `${ExportRecoveryPhrasePrefix}.InitiationSucceeded`,
  InitiationFailed = `${ExportRecoveryPhrasePrefix}.InitiationFailed`,

  CancellationStarted = `${ExportRecoveryPhrasePrefix}.CancellationStarted`,
  CancellationSucceeded = `${ExportRecoveryPhrasePrefix}.CancellationSucceeded`,
  CancellationFailed = `${ExportRecoveryPhrasePrefix}.CancellationFailed`,

  DecryptionStarted = `${ExportRecoveryPhrasePrefix}.DecryptionStarted`,
  DecryptionSucceeded = `${ExportRecoveryPhrasePrefix}.DecryptionSucceeded`,
  DecryptionFailed = `${ExportRecoveryPhrasePrefix}.DecryptionFailed`,

  PhraseCopied = `${ExportRecoveryPhrasePrefix}.PhraseCopied`,
}
