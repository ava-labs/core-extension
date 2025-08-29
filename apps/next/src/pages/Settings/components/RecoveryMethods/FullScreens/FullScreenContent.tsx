import { useSeedlessAuth } from '@core/ui';
import { RemoveTotp } from './RemoveTotp';

export const FullScreenContent = () => {
  // const {
  //   authenticate,
  //   step,
  //   methods,
  //   chooseMfaMethod,
  //   mfaDeviceName,
  //   error,
  //   verifyTotpCode,
  //   completeFidoChallenge,
  // } = useSeedlessAuth({
  //   getOidcToken,
  //   setIsLoading,
  //   onSignerTokenObtained: onAuthSuccess,
  // });

  return <RemoveTotp />;
  // const history = useHistory();
  // const { t } = useTranslation();
  // const { capture } = useAnalyticsContext();
  // const { setCurrent, setTotal, setIsBackButtonVisible } =
  //   useModalPageControl();
  // const { phase = 'connect-avax' } = useParams<{ phase: ImportRoute }>();
  // const { importLedger, isImporting } = useImportLedger();
  // const openApp = useOpenApp();

  // const [publicKeys, setPublicKeys] = useState<AddressPublicKeyJson[]>([]);
  // const [extPublicKeys, setExtPublicKeys] = useState<ExtendedPublicKey[]>([]);

  // useEffect(() => {
  //   const step = PHASE_TO_STEP_NUMBER[phase];

  //   if (step) {
  //     setCurrent(step);
  //     setTotal(TOTAL_STEPS);

  //     // We don't want to display the back button on the first screen
  //     // (it won't do anything, since history state is empty)
  //     setIsBackButtonVisible(step > 1);
  //   } else {
  //     // If we're on troubleshooting screens, hide the page indicator
  //     setTotal(0);
  //   }
  // }, [phase, setCurrent, setIsBackButtonVisible, setTotal]);

  // const avalancheConnectorCallbacks = useMemo(
  //   () => ({
  //     onConnectionSuccess: () => capture(`${ANALYTICS_EVENT_PREFIX}Connected`),
  //     onConnectionFailed: (err: Error) =>
  //       err instanceof WalletExistsError
  //         ? capture(`${ANALYTICS_EVENT_PREFIX}DuplicateWallet`)
  //         : capture(`${ANALYTICS_EVENT_PREFIX}ConnectionFailed`),
  //     onConnectionRetry: () => capture(`${ANALYTICS_EVENT_PREFIX}Retry`),
  //   }),
  //   [capture],
  // );

  // const solanaConnectorCallbacks = useMemo(
  //   () => ({
  //     onConnectionSuccess: () =>
  //       capture(`${ANALYTICS_EVENT_PREFIX}SolanaKeysDerived`),
  //     onConnectionFailed: () =>
  //       capture(`${ANALYTICS_EVENT_PREFIX}SolanaKeysFailed`),
  //     onConnectionRetry: () =>
  //       capture(`${ANALYTICS_EVENT_PREFIX}SolanaKeysRetry`),
  //   }),
  //   [capture],
  // );

  // const onSave = useCallback(
  //   async (name: string) => {
  //     try {
  //       await importLedger({
  //         name,
  //         addressPublicKeys: publicKeys,
  //         extendedPublicKeys: extPublicKeys,
  //       });
  //       openApp();
  //       window.close();
  //     } catch (err) {
  //       toast.error(t('Unknown error has occurred. Please try again later.'));
  //       console.error(err);
  //     }
  //   },
  //   [extPublicKeys, importLedger, publicKeys, openApp, t],
  // );

  return (
    <div>Fullscreen</div>
    // <Switch>
    //   <Route exact path={CONNECT_AVAX_PATHS}>
    //     <ConnectAvalanche
    //       connectorCallbacks={avalancheConnectorCallbacks}
    //       onNext={({ addressPublicKeys, extendedPublicKeys }) => {
    //         setPublicKeys(addressPublicKeys.map(({ key }) => key));
    //         setExtPublicKeys(extendedPublicKeys ?? []);
    //         history.push('/import-wallet/ledger/prompt-solana');
    //       }}
    //       onTroubleshoot={() => {
    //         capture(`${ANALYTICS_EVENT_PREFIX}TroubleshootingAvalanche`);
    //         history.push(`${BASE_PATH}/troubleshooting-avalanche`);
    //       }}
    //     />
    //   </Route>
    //   <Route path={`${BASE_PATH}/prompt-solana`}>
    //     <PromptSolana
    //       onNext={() => {
    //         capture(`${ANALYTICS_EVENT_PREFIX}SolanaSupportConfirmed`);
    //         history.push(`${BASE_PATH}/connect-solana`);
    //       }}
    //       onSkip={() => {
    //         capture(`${ANALYTICS_EVENT_PREFIX}SolanaSupportDenied`);
    //         history.push(`${BASE_PATH}/name`);
    //       }}
    //     />
    //   </Route>
    //   <Route path={`${BASE_PATH}/connect-solana`}>
    //     <ConnectSolana
    //       connectorCallbacks={solanaConnectorCallbacks}
    //       onNext={({ addressPublicKeys }) => {
    //         setPublicKeys((prev) => [
    //           ...prev,
    //           ...addressPublicKeys.map(({ key }) => key),
    //         ]);
    //         history.push(`${BASE_PATH}/name`);
    //       }}
    //       onTroubleshoot={() => {
    //         capture(`${ANALYTICS_EVENT_PREFIX}TroubleshootingSolana`);
    //         history.push(`${BASE_PATH}/troubleshooting-solana`);
    //       }}
    //     />
    //   </Route>
    //   <Route path={`${BASE_PATH}/troubleshooting-avalanche`}>
    //     <Troubleshooting
    //       appName="Avalanche"
    //       onClose={() => {
    //         capture(`${ANALYTICS_EVENT_PREFIX}TroubleshootingAvalancheClosed`);
    //         history.push(`${BASE_PATH}/connect-avax`);
    //       }}
    //     />
    //   </Route>
    //   <Route path={`${BASE_PATH}/troubleshooting-solana`}>
    //     <Troubleshooting
    //       appName="Solana"
    //       onClose={() => {
    //         capture(`${ANALYTICS_EVENT_PREFIX}TroubleshootingSolanaClosed`);
    //         history.push(`${BASE_PATH}/connect-solana`);
    //       }}
    //     />
    //   </Route>
    //   <Route path={`${BASE_PATH}/name`}>
    //     <NameYourWalletScreen
    //       step={PHASE_TO_STEP_NUMBER['name']}
    //       totalSteps={TOTAL_STEPS}
    //       isSaving={isImporting}
    //       onNext={onSave}
    //     />
    //   </Route>
    // </Switch>
  );
};
