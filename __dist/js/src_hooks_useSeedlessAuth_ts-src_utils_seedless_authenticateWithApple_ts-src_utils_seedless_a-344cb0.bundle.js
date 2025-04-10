"use strict";
(self["webpackChunkavalanche_extension"] = self["webpackChunkavalanche_extension"] || []).push([["src_hooks_useSeedlessAuth_ts-src_utils_seedless_authenticateWithApple_ts-src_utils_seedless_a-344cb0"],{

/***/ "./src/background/services/seedless/utils.ts":
/*!***************************************************!*\
  !*** ./src/background/services/seedless/utils.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isExportRequestOutdated": () => (/* binding */ isExportRequestOutdated),
/* harmony export */   "isFailedMfaError": () => (/* binding */ isFailedMfaError),
/* harmony export */   "isTokenExpiredError": () => (/* binding */ isTokenExpiredError),
/* harmony export */   "mapMfasToRecoveryMethods": () => (/* binding */ mapMfasToRecoveryMethods)
/* harmony export */ });
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ "./src/background/services/seedless/models.ts");

const isTokenExpiredError = err => {
  // When CubeSigner's refresh token (or the entire session) expires,
  // we get a 403 Forbidden error on attempted API calls.
  return err instanceof Error && 'status' in err && err.status === 403;
};
const isFailedMfaError = err => {
  // When CubeSigner's refresh token (or the entire session) expires,
  // we get a 403 Forbidden error on attempted API calls.
  return err instanceof Error && 'status' in err && err.status === 403 && err.message.includes('Invalid');
};
const isExportRequestOutdated = exportRequest => exportRequest.exp_epoch <= Date.now() / 1000;
const mapMfasToRecoveryMethods = method => {
  if (method.type === 'fido') {
    return {
      ...method,
      type: _models__WEBPACK_IMPORTED_MODULE_0__.MfaRequestType.Fido
    };
  }
  return {
    type: _models__WEBPACK_IMPORTED_MODULE_0__.MfaRequestType.Totp
  };
};

/***/ }),

/***/ "./src/hooks/useSeedlessAuth.ts":
/*!**************************************!*\
  !*** ./src/hooks/useSeedlessAuth.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthStep": () => (/* binding */ AuthStep),
/* harmony export */   "useSeedlessAuth": () => (/* binding */ useSeedlessAuth)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @src/monitoring/sentryCaptureException */ "./src/monitoring/sentryCaptureException.ts");
/* harmony import */ var _src_utils_seedless_getSignerToken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @src/utils/seedless/getSignerToken */ "./src/utils/seedless/getSignerToken.ts");
/* harmony import */ var _src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @src/utils/seedless/getCubeSigner */ "./src/utils/seedless/getCubeSigner.ts");
/* harmony import */ var _src_utils_seedless_fido_launchFidoFlow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @src/utils/seedless/fido/launchFidoFlow */ "./src/utils/seedless/fido/launchFidoFlow.ts");
/* harmony import */ var _src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @src/utils/seedless/fido/types */ "./src/utils/seedless/fido/types.ts");
/* harmony import */ var _src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @src/contexts/AnalyticsProvider */ "./src/contexts/AnalyticsProvider.tsx");
/* harmony import */ var _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @src/background/services/seedless/models */ "./src/background/services/seedless/models.ts");
/* harmony import */ var _src_background_services_seedless_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @src/background/services/seedless/utils */ "./src/background/services/seedless/utils.ts");









let AuthStep = /*#__PURE__*/function (AuthStep) {
  AuthStep[AuthStep["NotInitialized"] = 0] = "NotInitialized";
  AuthStep[AuthStep["Initialized"] = 1] = "Initialized";
  AuthStep[AuthStep["Complete"] = 2] = "Complete";
  AuthStep[AuthStep["TotpChallenge"] = 3] = "TotpChallenge";
  AuthStep[AuthStep["FidoChallenge"] = 4] = "FidoChallenge";
  AuthStep[AuthStep["ChooseMfaMethod"] = 5] = "ChooseMfaMethod";
  return AuthStep;
}({});
const useSeedlessAuth = ({
  getOidcToken,
  setIsLoading,
  onSignerTokenObtained
}) => {
  const [oidcToken, setOidcToken] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [step, setStep] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(AuthStep.NotInitialized);
  const [session, setSession] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [mfaId, setMfaId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [email, setEmail] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [userId, setUserId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [mfaDeviceName, setMfaDeviceName] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    capture
  } = (0,_src_contexts_AnalyticsProvider__WEBPACK_IMPORTED_MODULE_6__.useAnalyticsContext)();
  const [methods, setMethods] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const chooseMfaMethod = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(method => {
    if (method.type === _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.MfaRequestType.Fido) {
      setStep(AuthStep.FidoChallenge);
      setMfaDeviceName(method.name);
    } else if (method.type === _src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.MfaRequestType.Totp) {
      setStep(AuthStep.TotpChallenge);
      setMfaDeviceName('');
    } else {
      setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.UnsupportedMfaMethod);
    }
  }, []);
  const getUserDetails = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async idToken => {
    const client = (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.getOidcClient)(idToken);
    const identity = await client.identityProve();
    const mfaMethods = identity.user_info?.configured_mfa ?? [];
    return {
      email: identity.email ?? '',
      userId: identity.identity?.sub,
      mfaMethods
    };
  }, []);
  const authenticate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async ({
    expectedEmail,
    expectedUserId
  }) => {
    setStep(AuthStep.Initialized);
    setEmail('');
    setUserId('');
    setIsLoading(true);
    setMfaDeviceName('');
    try {
      const idToken = await getOidcToken();
      if (!idToken) {
        capture('SeedlessLoginFailed');
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.FailedToFetchOidcToken);
        return;
      }
      const {
        email: obtainedEmail,
        userId: obtainedUserId,
        mfaMethods
      } = await getUserDetails(idToken);
      setEmail(obtainedEmail);
      setUserId(obtainedUserId);
      if (!obtainedUserId) {
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.MissingUserId);
        return;
      }

      // Old onboardgin process for seedless did not store user ID. The expectedUserId might be missing
      if (expectedUserId && expectedUserId !== obtainedUserId) {
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.MismatchingUserId);
        return;
      }

      // If expectedUserId is not available, we need to check if the emails match
      if (!expectedUserId && expectedEmail && obtainedEmail !== expectedEmail) {
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.MismatchingEmail);
        return;
      }
      setOidcToken(idToken);
      const authResponse = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(idToken);
      const requiresMfa = authResponse.requiresMfa();
      if (!requiresMfa) {
        setStep(AuthStep.Complete);
        const token = await (0,_src_utils_seedless_getSignerToken__WEBPACK_IMPORTED_MODULE_2__.getSignerToken)(authResponse);
        await onSignerTokenObtained?.(token, obtainedEmail, obtainedUserId);
        return;
      }
      const mfaSessionInfo = authResponse.mfaSessionInfo();
      if (mfaSessionInfo) {
        setMfaId(authResponse.mfaId());
        setSession(await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.getSignerSession)(mfaSessionInfo));
        if (!mfaMethods.length) {
          setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.NoMfaMethodsConfigured);
          return false;
        }
        if (mfaMethods.length === 1) {
          const method = mfaMethods[0];
          if (method.type === 'totp') {
            setStep(AuthStep.TotpChallenge);
          } else if (method.type === 'fido') {
            setStep(AuthStep.FidoChallenge);
            setMfaDeviceName(method.name);
          } else {
            setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.UnsupportedMfaMethod);
            return false;
          }
        } else {
          setStep(AuthStep.ChooseMfaMethod);
          setMethods(mfaMethods.map(_src_background_services_seedless_utils__WEBPACK_IMPORTED_MODULE_8__.mapMfasToRecoveryMethods));
        }
      } else {
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.NoMfaDetails);
        (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__["default"])(new Error('MFA is required, but no details were provided'), _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__.SentryExceptionTypes.SEEDLESS);
      }
    } catch (err) {
      setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.UnknownError);
      (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__["default"])(err, _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__.SentryExceptionTypes.SEEDLESS);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, getOidcToken, getUserDetails, capture, onSignerTokenObtained]);
  const verifyTotpCode = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async totpCode => {
    if (!session) {
      setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.UnknownError);
      (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__["default"])(new Error('Session not carried over from initial authentication'), _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__.SentryExceptionTypes.SEEDLESS);
      return false;
    }
    setIsLoading(true);
    setError(undefined);
    let status;
    try {
      status = await session.totpApprove(mfaId, totpCode);
      if (!status.receipt?.confirmation) {
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.TotpVerificationError);
        capture(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.TotpVerificationError);
        setIsLoading(false);
        return false;
      }
    } catch {
      setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.InvalidTotpCode);
      capture(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.InvalidTotpCode);
      setIsLoading(false);
      return false;
    }
    try {
      const oidcAuthResponse = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(oidcToken, {
        mfaOrgId: "Org#abc03353-9320-4bf4-bc25-d1b687bf2b2c" || 0,
        mfaId,
        mfaConf: status.receipt.confirmation
      });
      const token = await (0,_src_utils_seedless_getSignerToken__WEBPACK_IMPORTED_MODULE_2__.getSignerToken)(oidcAuthResponse);
      if (!token) {
        capture('TotpNoToken');
        return false;
      }
      if (!userId) {
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.MissingUserId);
        return false;
      }
      await onSignerTokenObtained?.(token, email, userId);
      capture('TotpVaridationSuccess');
      return true;
    } catch (err) {
      setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.UnknownError);
      capture('TotpVaridationFailed');
      (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__["default"])(err, _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__.SentryExceptionTypes.SEEDLESS);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, setIsLoading, mfaId, capture, oidcToken, userId, onSignerTokenObtained, email]);
  const completeFidoChallenge = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!session) {
      setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.UnknownError);
      (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__["default"])(new Error('Session not carried over from initial authentication'), _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__.SentryExceptionTypes.SEEDLESS);
      return false;
    }
    setIsLoading(true);
    setError(undefined);
    try {
      const challenge = await session.fidoApproveStart(mfaId);
      let mfaInfo;
      try {
        // prompt the user to tap their FIDO and send the answer back to CubeSigner
        const answer = await (0,_src_utils_seedless_fido_launchFidoFlow__WEBPACK_IMPORTED_MODULE_4__.launchFidoFlow)(_src_utils_seedless_fido_types__WEBPACK_IMPORTED_MODULE_5__.FIDOApiEndpoint.Authenticate, challenge.options);
        mfaInfo = await challenge.answer(answer);
      } catch {
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.FidoChallengeFailed);
        return false;
      }

      // print out the current status of the MFA request and assert that it has been approved
      if (!mfaInfo.receipt) {
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.FidoChallengeNotApproved);
        return false;
      }

      // proceed with the MFA approval
      let authResponse = await (0,_src_utils_seedless_getCubeSigner__WEBPACK_IMPORTED_MODULE_3__.requestOidcAuth)(oidcToken);
      authResponse = await authResponse.signWithMfaApproval({
        mfaId,
        mfaOrgId: "Org#abc03353-9320-4bf4-bc25-d1b687bf2b2c" || 0,
        mfaConf: mfaInfo.receipt.confirmation
      });
      if (authResponse.requiresMfa()) {
        setIsLoading(false);
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.UnknownError);
        (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__["default"])(new Error('MFA should not be required after approval'), _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__.SentryExceptionTypes.SEEDLESS);
        return false;
      }
      if (!userId) {
        setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.MissingUserId);
        return false;
      }
      await onSignerTokenObtained?.(await (0,_src_utils_seedless_getSignerToken__WEBPACK_IMPORTED_MODULE_2__.getSignerToken)(authResponse), email, userId);
      return true;
    } catch (err) {
      setError(_src_background_services_seedless_models__WEBPACK_IMPORTED_MODULE_7__.AuthErrorCode.UnknownError);
      (0,_src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__["default"])(err, _src_monitoring_sentryCaptureException__WEBPACK_IMPORTED_MODULE_1__.SentryExceptionTypes.SEEDLESS);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [email, mfaId, oidcToken, onSignerTokenObtained, session, setIsLoading, userId]);
  return {
    error,
    oidcToken,
    step,
    email,
    methods,
    chooseMfaMethod,
    authenticate,
    verifyTotpCode,
    completeFidoChallenge,
    mfaDeviceName
  };
};

/***/ }),

/***/ "./src/pages/Onboarding/utils/launchWebAuthFlow.ts":
/*!*********************************************************!*\
  !*** ./src/pages/Onboarding/utils/launchWebAuthFlow.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "launchWebAuthFlow": () => (/* binding */ launchWebAuthFlow)
/* harmony export */ });
function launchWebAuthFlow(url) {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow({
      url: url.toString(),
      interactive: true
    }, redirectedTo => {
      if (!redirectedTo) {
        reject(new Error('Redirect url is undefined'));
        return;
      }
      if (chrome.runtime.lastError) {
        // Example: Authorization page could not be loaded.
        return reject(chrome.runtime.lastError);
      }
      const parsedUrl = new URL(redirectedTo);
      const params = new URLSearchParams(parsedUrl.hash.slice(1)); // hash contains a query string
      const idToken = params.get('id_token');
      if (!idToken) {
        throw new Error('no id token');
      }
      resolve(idToken);
    });
  });
}

/***/ }),

/***/ "./src/utils/seedless/authenticateWithApple.ts":
/*!*****************************************************!*\
  !*** ./src/utils/seedless/authenticateWithApple.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "authenticateWithApple": () => (/* binding */ authenticateWithApple)
/* harmony export */ });
/* harmony import */ var _pages_Onboarding_utils_launchWebAuthFlow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pages/Onboarding/utils/launchWebAuthFlow */ "./src/pages/Onboarding/utils/launchWebAuthFlow.ts");

async function authenticateWithApple() {
  const clientId = "org.avalabs.corewallet.extension";
  const redirectUrl = "https://seedless-api.avax-test.network/v1/redirectAppleAuth";

  // This is the base URL that the Core Seedless API should redirect to after receiving the data from Apple.
  const baseUrl = 'https://' + chrome.runtime.id + '.chromiumapp.org';
  if (!clientId || !redirectUrl) {
    throw new Error('Apple OAuth not configured');
  }
  const url = new URL('https://appleid.apple.com/auth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('nonce', crypto.randomUUID());
  url.searchParams.set('response_type', 'code id_token');
  url.searchParams.set('state', baseUrl);
  url.searchParams.set('redirect_uri', redirectUrl);
  url.searchParams.set('scope', 'email');
  // "form_post" response mode is forced since we request user's email in "scope".
  // Reference: https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server#query-parameters
  url.searchParams.set('response_mode', 'form_post');
  return (0,_pages_Onboarding_utils_launchWebAuthFlow__WEBPACK_IMPORTED_MODULE_0__.launchWebAuthFlow)(url);
}

/***/ }),

/***/ "./src/utils/seedless/authenticateWithGoogle.ts":
/*!******************************************************!*\
  !*** ./src/utils/seedless/authenticateWithGoogle.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "authenticateWithGoogle": () => (/* binding */ authenticateWithGoogle)
/* harmony export */ });
/* harmony import */ var _pages_Onboarding_utils_launchWebAuthFlow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pages/Onboarding/utils/launchWebAuthFlow */ "./src/pages/Onboarding/utils/launchWebAuthFlow.ts");

async function authenticateWithGoogle() {
  const manifest = chrome.runtime.getManifest();
  if (!manifest.oauth2 || !manifest.oauth2.scopes) {
    throw new Error('Oauth not configured');
  }
  const redirectUri = 'https://' + chrome.runtime.id + '.chromiumapp.org';
  const url = new URL('https://accounts.google.com/o/oauth2/auth');
  url.searchParams.set('client_id', manifest.oauth2.client_id);
  url.searchParams.set('response_type', 'id_token');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', manifest.oauth2.scopes.join(' '));
  return (0,_pages_Onboarding_utils_launchWebAuthFlow__WEBPACK_IMPORTED_MODULE_0__.launchWebAuthFlow)(url);
}

/***/ }),

/***/ "./src/utils/seedless/getCubeSigner.ts":
/*!*********************************************!*\
  !*** ./src/utils/seedless/getCubeSigner.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getEnv": () => (/* binding */ getEnv),
/* harmony export */   "getOidcClient": () => (/* binding */ getOidcClient),
/* harmony export */   "getOrgId": () => (/* binding */ getOrgId),
/* harmony export */   "getSignerSession": () => (/* binding */ getSignerSession),
/* harmony export */   "requestOidcAuth": () => (/* binding */ requestOidcAuth)
/* harmony export */ });
/* harmony import */ var _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cubist-labs/cubesigner-sdk */ "./node_modules/@cubist-labs/cubesigner-sdk/dist/cjs/src/index.js");
/* harmony import */ var _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Get the CubeSigner deployment environment to use.
 *
 * Defaults to 'gamma' but can be overridden via the 'CUBESIGNER_ENV' environment variable.
 *
 * @return {EnvInterface} CubeSigner deployment environment
 */
function getEnv() {
  return _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.envs["gamma" || 0];
}

/**
 * Get the ID of the CubeSigner organization to use.
 *
 * Must be set via the 'SEEDLESS_ORG_ID' environment variable.
 *
 * @return {string} The ID of the organization in CubeSigner.
 */
function getOrgId() {
  const orgId = "Org#abc03353-9320-4bf4-bc25-d1b687bf2b2c";
  if (!orgId) {
    throw new Error('SEEDLESS_ORG_ID must be set');
  }
  return orgId;
}

/**
 * Create a CubeSigner API client for methods that require OIDC authorization.
 *
 * This client can be used to:
 * - obtain a proof of identity (see {@link OidcClient.identityProve})
 * - obtain a full CubeSigner session (see {@link OidcClient.sessionCreate})
 *
 * @param {string} oidcToken The OIDC token to include in 'Authorization' header.
 * @return {OidcClient} CubeSigner API client for methods that require OIDC authorization.
 */
function getOidcClient(oidcToken) {
  return new _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.OidcClient(getEnv(), getOrgId(), oidcToken);
}

/**
 * Create a CubeSigner API client for methods that require signer session authorization.
 *
 * @param {NewSessionResponse | SignerSessionData} sessionInfo Signer session information
 *  (e.g., obtained via {@link OidcClient.sessionCreate}) from which to construct the client.
 * @return {SignerSession} CubeSigner API client.
 */
async function getSignerSession(sessionInfo) {
  return new _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.SignerSession(await _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.SignerSessionManager.createFromSessionInfo(getEnv(), getOrgId(), sessionInfo));
}

/**
 * Request a new CubeSigner session by logging in via OIDC.
 *
 * The new session can be passed to {@link getSignerSession} to create a CubeSigner API client.
 *
 * @param {string} oidcToken The OIDC token to include in 'Authorization' header.
 * @param {MfaReceipt | undefined} mfaReceipt Optional MFA receipt to attach to this request.
 * @return {CubeSignerResponse<SignerSessionData>} The response. If MFA for this request is
 *   required, {@link CubeSignerResponse.requiresMfa()} is set to true and
 *   {@link CubeSignerResponse.mfaSessionInfo()} contains a temporary session that allows
 *   access to the CubeSigner MFA endpoints; otherwise, {@link CubeSignerResponse.data()}
 *   contains the new session information.
 */
async function requestOidcAuth(oidcToken, mfaReceipt) {
  const oidcClient = getOidcClient(oidcToken);
  return await oidcClient.sessionCreate(['sign:*', 'manage:*', 'export:*'], {
    // How long singing with a particular token works from the token creation
    auth_lifetime: 5 * 60,
    // 5 minutes
    // How long a refresh token is valid, the user has to unlock Core in this timeframe otherwise they will have to re-login
    // Sessions expire either if the session lifetime expires or if a refresh token expires before a new one is generated
    refresh_lifetime: 90 * 24 * 60 * 60,
    // 90 days
    // How long till the user absolutely must sign in again
    session_lifetime: 1 * 365 * 24 * 60 * 60 // 1 year
  }, mfaReceipt);
}

/***/ }),

/***/ "./src/utils/seedless/getSignerToken.ts":
/*!**********************************************!*\
  !*** ./src/utils/seedless/getSignerToken.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getSignerToken": () => (/* binding */ getSignerToken)
/* harmony export */ });
/* harmony import */ var _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cubist-labs/cubesigner-sdk */ "./node_modules/@cubist-labs/cubesigner-sdk/dist/cjs/src/index.js");
/* harmony import */ var _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__);

const getSignerToken = async oidcAuthResponse => {
  const sessionInfo = oidcAuthResponse.data();
  const sessionMgr = await _cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.SignerSessionManager.createFromSessionInfo(_cubist_labs_cubesigner_sdk__WEBPACK_IMPORTED_MODULE_0__.envs["gamma" || 0], "Org#abc03353-9320-4bf4-bc25-d1b687bf2b2c" || 0, sessionInfo);
  return sessionMgr.storage.retrieve();
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX2hvb2tzX3VzZVNlZWRsZXNzQXV0aF90cy1zcmNfdXRpbHNfc2VlZGxlc3NfYXV0aGVudGljYXRlV2l0aEFwcGxlX3RzLXNyY191dGlsc19zZWVkbGVzc19hLTM0NGNiMC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLMEQ7QUFFbkQsTUFBTUMsbUJBQW1CLEdBQzlCQyxHQUFZLElBQ3VCO0VBQ25DO0VBQ0E7RUFDQSxPQUFPQSxHQUFHLFlBQVlDLEtBQUssSUFBSSxRQUFRLElBQUlELEdBQUcsSUFBSUEsR0FBRyxDQUFDRSxNQUFNLEtBQUssR0FBRztBQUN0RSxDQUFDO0FBRU0sTUFBTUMsZ0JBQWdCLEdBQzNCSCxHQUFZLElBQ3VCO0VBQ25DO0VBQ0E7RUFDQSxPQUNFQSxHQUFHLFlBQVlDLEtBQUssSUFDcEIsUUFBUSxJQUFJRCxHQUFHLElBQ2ZBLEdBQUcsQ0FBQ0UsTUFBTSxLQUFLLEdBQUcsSUFDbEJGLEdBQUcsQ0FBQ0ksT0FBTyxDQUFDQyxRQUFRLENBQUMsU0FBUyxDQUFDO0FBRW5DLENBQUM7QUFFTSxNQUFNQyx1QkFBdUIsR0FDbENDLGFBQXFDLElBQ2xDQSxhQUFhLENBQUNDLFNBQVMsSUFBSUMsSUFBSSxDQUFDQyxHQUFHLEVBQUUsR0FBRyxJQUFJO0FBRTFDLE1BQU1DLHdCQUF3QixHQUNuQ0MsTUFBdUUsSUFDcEQ7RUFDbkIsSUFBSUEsTUFBTSxDQUFDQyxJQUFJLEtBQUssTUFBTSxFQUFFO0lBQzFCLE9BQU87TUFDTCxHQUFHRCxNQUFNO01BQ1RDLElBQUksRUFBRWYsd0RBQW1CZ0I7SUFDM0IsQ0FBQztFQUNIO0VBRUEsT0FBTztJQUNMRCxJQUFJLEVBQUVmLHdEQUFtQmlCO0VBQzNCLENBQUM7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Q3VFO0FBU3hCO0FBRW9CO0FBS3pCO0FBRThCO0FBQ1I7QUFDSztBQUtwQjtBQUNpQztBQUU1RSxJQUFLYSxRQUFRLDBCQUFSQSxRQUFRO0VB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Q0FDWixDQUNGO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxlQUFldkksZUFBZUEsQ0FDbkNVLFNBQWlCLEVBQ2pCK0gsVUFBbUMsRUFDYTtFQUNoRCxNQUFNQyxVQUFVLEdBQUc1SSxhQUFhLENBQUNZLFNBQVMsQ0FBQztFQUMzQyxPQUFPLE1BQU1nSSxVQUFVLENBQUNDLGFBQWEsQ0FDbkMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUNsQztJQUNFO0lBQ0FDLGFBQWEsRUFBRSxDQUFDLEdBQUcsRUFBRTtJQUFFO0lBQ3ZCO0lBQ0E7SUFDQUMsZ0JBQWdCLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtJQUFFO0lBQ3JDO0lBQ0FDLGdCQUFnQixFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUU7RUFDNUMsQ0FBQyxFQUNETCxVQUFVLENBQ1g7QUFDSDs7Ozs7Ozs7Ozs7Ozs7OztBQ2pHcUM7QUFFOUIsTUFBTTVJLGNBQWMsR0FBRyxNQUM1QjZFLGdCQUE4RCxJQUMvQjtFQUMvQixNQUFNNkQsV0FBVyxHQUFHN0QsZ0JBQWdCLENBQUNxRSxJQUFJLEVBQUU7RUFDM0MsTUFBTUMsVUFBVSxHQUFHLE1BQU1mLG1HQUEwQyxDQUNqRUMsNkRBQUksQ0FBQ3RELE9BQTBCLElBQUksQ0FBRSxDQUFDLEVBQ3RDQSwwQ0FBMkIsSUFBSSxDQUFFLEVBQ2pDMkQsV0FBVyxDQUNaO0VBRUQsT0FBT1MsVUFBVSxDQUFDQyxPQUFPLENBQUNDLFFBQVEsRUFBRTtBQUN0QyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3NlZWRsZXNzL3V0aWxzLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvaG9va3MvdXNlU2VlZGxlc3NBdXRoLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvcGFnZXMvT25ib2FyZGluZy91dGlscy9sYXVuY2hXZWJBdXRoRmxvdy50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL3NlZWRsZXNzL2F1dGhlbnRpY2F0ZVdpdGhBcHBsZS50cyIsIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL3V0aWxzL3NlZWRsZXNzL2F1dGhlbnRpY2F0ZVdpdGhHb29nbGUudHMiLCJ3ZWJwYWNrOi8vYXZhbGFuY2hlLWV4dGVuc2lvbi8uL3NyYy91dGlscy9zZWVkbGVzcy9nZXRDdWJlU2lnbmVyLnRzIiwid2VicGFjazovL2F2YWxhbmNoZS1leHRlbnNpb24vLi9zcmMvdXRpbHMvc2VlZGxlc3MvZ2V0U2lnbmVyVG9rZW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgU2lnbmVyU2Vzc2lvbixcbiAgVXNlckV4cG9ydEluaXRSZXNwb25zZSxcbn0gZnJvbSAnQGN1YmlzdC1sYWJzL2N1YmVzaWduZXItc2RrJztcbmltcG9ydCB7IEFycmF5RWxlbWVudCB9IGZyb20gJ0BzcmMvYmFja2dyb3VuZC9tb2RlbHMnO1xuaW1wb3J0IHsgTWZhUmVxdWVzdFR5cGUsIFJlY292ZXJ5TWV0aG9kIH0gZnJvbSAnLi9tb2RlbHMnO1xuXG5leHBvcnQgY29uc3QgaXNUb2tlbkV4cGlyZWRFcnJvciA9IChcbiAgZXJyOiB1bmtub3duLFxuKTogZXJyIGlzIEVycm9yICYgeyBzdGF0dXM6IDQwMyB9ID0+IHtcbiAgLy8gV2hlbiBDdWJlU2lnbmVyJ3MgcmVmcmVzaCB0b2tlbiAob3IgdGhlIGVudGlyZSBzZXNzaW9uKSBleHBpcmVzLFxuICAvLyB3ZSBnZXQgYSA0MDMgRm9yYmlkZGVuIGVycm9yIG9uIGF0dGVtcHRlZCBBUEkgY2FsbHMuXG4gIHJldHVybiBlcnIgaW5zdGFuY2VvZiBFcnJvciAmJiAnc3RhdHVzJyBpbiBlcnIgJiYgZXJyLnN0YXR1cyA9PT0gNDAzO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzRmFpbGVkTWZhRXJyb3IgPSAoXG4gIGVycjogdW5rbm93bixcbik6IGVyciBpcyBFcnJvciAmIHsgc3RhdHVzOiA0MDMgfSA9PiB7XG4gIC8vIFdoZW4gQ3ViZVNpZ25lcidzIHJlZnJlc2ggdG9rZW4gKG9yIHRoZSBlbnRpcmUgc2Vzc2lvbikgZXhwaXJlcyxcbiAgLy8gd2UgZ2V0IGEgNDAzIEZvcmJpZGRlbiBlcnJvciBvbiBhdHRlbXB0ZWQgQVBJIGNhbGxzLlxuICByZXR1cm4gKFxuICAgIGVyciBpbnN0YW5jZW9mIEVycm9yICYmXG4gICAgJ3N0YXR1cycgaW4gZXJyICYmXG4gICAgZXJyLnN0YXR1cyA9PT0gNDAzICYmXG4gICAgZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ0ludmFsaWQnKVxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzRXhwb3J0UmVxdWVzdE91dGRhdGVkID0gKFxuICBleHBvcnRSZXF1ZXN0OiBVc2VyRXhwb3J0SW5pdFJlc3BvbnNlLFxuKSA9PiBleHBvcnRSZXF1ZXN0LmV4cF9lcG9jaCA8PSBEYXRlLm5vdygpIC8gMTAwMDtcblxuZXhwb3J0IGNvbnN0IG1hcE1mYXNUb1JlY292ZXJ5TWV0aG9kcyA9IChcbiAgbWV0aG9kOiBBcnJheUVsZW1lbnQ8QXdhaXRlZDxSZXR1cm5UeXBlPFNpZ25lclNlc3Npb25bJ3VzZXInXT4+WydtZmEnXT4sXG4pOiBSZWNvdmVyeU1ldGhvZCA9PiB7XG4gIGlmIChtZXRob2QudHlwZSA9PT0gJ2ZpZG8nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm1ldGhvZCxcbiAgICAgIHR5cGU6IE1mYVJlcXVlc3RUeXBlLkZpZG8sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogTWZhUmVxdWVzdFR5cGUuVG90cCxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBEaXNwYXRjaCwgU2V0U3RhdGVBY3Rpb24sIHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIE1mYVJlcXVlc3RJbmZvLFxuICBTaWduZXJTZXNzaW9uLFxuICBTaWduZXJTZXNzaW9uRGF0YSxcbn0gZnJvbSAnQGN1YmlzdC1sYWJzL2N1YmVzaWduZXItc2RrJztcblxuaW1wb3J0IHNlbnRyeUNhcHR1cmVFeGNlcHRpb24sIHtcbiAgU2VudHJ5RXhjZXB0aW9uVHlwZXMsXG59IGZyb20gJ0BzcmMvbW9uaXRvcmluZy9zZW50cnlDYXB0dXJlRXhjZXB0aW9uJztcblxuaW1wb3J0IHsgZ2V0U2lnbmVyVG9rZW4gfSBmcm9tICdAc3JjL3V0aWxzL3NlZWRsZXNzL2dldFNpZ25lclRva2VuJztcbmltcG9ydCB7XG4gIGdldE9pZGNDbGllbnQsXG4gIGdldFNpZ25lclNlc3Npb24sXG4gIHJlcXVlc3RPaWRjQXV0aCxcbn0gZnJvbSAnQHNyYy91dGlscy9zZWVkbGVzcy9nZXRDdWJlU2lnbmVyJztcbmltcG9ydCB7IE9pZGNUb2tlbkdldHRlciB9IGZyb20gJ0BzcmMvdXRpbHMvc2VlZGxlc3MvZ2V0T2lkY1Rva2VuUHJvdmlkZXInO1xuaW1wb3J0IHsgbGF1bmNoRmlkb0Zsb3cgfSBmcm9tICdAc3JjL3V0aWxzL3NlZWRsZXNzL2ZpZG8vbGF1bmNoRmlkb0Zsb3cnO1xuaW1wb3J0IHsgRklET0FwaUVuZHBvaW50IH0gZnJvbSAnQHNyYy91dGlscy9zZWVkbGVzcy9maWRvL3R5cGVzJztcbmltcG9ydCB7IHVzZUFuYWx5dGljc0NvbnRleHQgfSBmcm9tICdAc3JjL2NvbnRleHRzL0FuYWx5dGljc1Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIEF1dGhFcnJvckNvZGUsXG4gIE1mYVJlcXVlc3RUeXBlLFxuICBSZWNvdmVyeU1ldGhvZCxcbn0gZnJvbSAnQHNyYy9iYWNrZ3JvdW5kL3NlcnZpY2VzL3NlZWRsZXNzL21vZGVscyc7XG5pbXBvcnQgeyBtYXBNZmFzVG9SZWNvdmVyeU1ldGhvZHMgfSBmcm9tICdAc3JjL2JhY2tncm91bmQvc2VydmljZXMvc2VlZGxlc3MvdXRpbHMnO1xuXG5leHBvcnQgZW51bSBBdXRoU3RlcCB7XG4gIE5vdEluaXRpYWxpemVkLFxuICBJbml0aWFsaXplZCxcbiAgQ29tcGxldGUsXG4gIFRvdHBDaGFsbGVuZ2UsXG4gIEZpZG9DaGFsbGVuZ2UsXG4gIENob29zZU1mYU1ldGhvZCxcbn1cblxuZXhwb3J0IHR5cGUgVXNlU2VlZGxlc3NBdXRoT3B0aW9ucyA9IHtcbiAgZ2V0T2lkY1Rva2VuOiBPaWRjVG9rZW5HZXR0ZXI7XG4gIHNldElzTG9hZGluZzogRGlzcGF0Y2g8U2V0U3RhdGVBY3Rpb248Ym9vbGVhbj4+O1xuICBvblNpZ25lclRva2VuT2J0YWluZWQ6IChcbiAgICB0b2tlbjogU2lnbmVyU2Vzc2lvbkRhdGEsXG4gICAgZW1haWw6IHN0cmluZyxcbiAgICB1c2VySWQ6IHN0cmluZyxcbiAgKSA9PiBQcm9taXNlPHZvaWQ+O1xufTtcblxuZXhwb3J0IGNvbnN0IHVzZVNlZWRsZXNzQXV0aCA9ICh7XG4gIGdldE9pZGNUb2tlbixcbiAgc2V0SXNMb2FkaW5nLFxuICBvblNpZ25lclRva2VuT2J0YWluZWQsXG59OiBVc2VTZWVkbGVzc0F1dGhPcHRpb25zKSA9PiB7XG4gIGNvbnN0IFtvaWRjVG9rZW4sIHNldE9pZGNUb2tlbl0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtzdGVwLCBzZXRTdGVwXSA9IHVzZVN0YXRlKEF1dGhTdGVwLk5vdEluaXRpYWxpemVkKTtcbiAgY29uc3QgW3Nlc3Npb24sIHNldFNlc3Npb25dID0gdXNlU3RhdGU8U2lnbmVyU2Vzc2lvbj4oKTtcbiAgY29uc3QgW21mYUlkLCBzZXRNZmFJZF0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8QXV0aEVycm9yQ29kZT4oKTtcbiAgY29uc3QgW2VtYWlsLCBzZXRFbWFpbF0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFt1c2VySWQsIHNldFVzZXJJZF0gPSB1c2VTdGF0ZTxzdHJpbmc+KCk7XG4gIGNvbnN0IFttZmFEZXZpY2VOYW1lLCBzZXRNZmFEZXZpY2VOYW1lXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgeyBjYXB0dXJlIH0gPSB1c2VBbmFseXRpY3NDb250ZXh0KCk7XG4gIGNvbnN0IFttZXRob2RzLCBzZXRNZXRob2RzXSA9IHVzZVN0YXRlPFJlY292ZXJ5TWV0aG9kW10+KFtdKTtcblxuICBjb25zdCBjaG9vc2VNZmFNZXRob2QgPSB1c2VDYWxsYmFjaygobWV0aG9kOiBSZWNvdmVyeU1ldGhvZCkgPT4ge1xuICAgIGlmIChtZXRob2QudHlwZSA9PT0gTWZhUmVxdWVzdFR5cGUuRmlkbykge1xuICAgICAgc2V0U3RlcChBdXRoU3RlcC5GaWRvQ2hhbGxlbmdlKTtcbiAgICAgIHNldE1mYURldmljZU5hbWUobWV0aG9kLm5hbWUpO1xuICAgIH0gZWxzZSBpZiAobWV0aG9kLnR5cGUgPT09IE1mYVJlcXVlc3RUeXBlLlRvdHApIHtcbiAgICAgIHNldFN0ZXAoQXV0aFN0ZXAuVG90cENoYWxsZW5nZSk7XG4gICAgICBzZXRNZmFEZXZpY2VOYW1lKCcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0RXJyb3IoQXV0aEVycm9yQ29kZS5VbnN1cHBvcnRlZE1mYU1ldGhvZCk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgY29uc3QgZ2V0VXNlckRldGFpbHMgPSB1c2VDYWxsYmFjayhhc3luYyAoaWRUb2tlbikgPT4ge1xuICAgIGNvbnN0IGNsaWVudCA9IGdldE9pZGNDbGllbnQoaWRUb2tlbik7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBjbGllbnQuaWRlbnRpdHlQcm92ZSgpO1xuICAgIGNvbnN0IG1mYU1ldGhvZHMgPSBpZGVudGl0eS51c2VyX2luZm8/LmNvbmZpZ3VyZWRfbWZhID8/IFtdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVtYWlsOiBpZGVudGl0eS5lbWFpbCA/PyAnJyxcbiAgICAgIHVzZXJJZDogaWRlbnRpdHkuaWRlbnRpdHk/LnN1YixcbiAgICAgIG1mYU1ldGhvZHMsXG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGF1dGhlbnRpY2F0ZSA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jICh7XG4gICAgICBleHBlY3RlZEVtYWlsLFxuICAgICAgZXhwZWN0ZWRVc2VySWQsXG4gICAgfToge1xuICAgICAgZXhwZWN0ZWRFbWFpbD86IHN0cmluZztcbiAgICAgIGV4cGVjdGVkVXNlcklkPzogc3RyaW5nO1xuICAgIH0pID0+IHtcbiAgICAgIHNldFN0ZXAoQXV0aFN0ZXAuSW5pdGlhbGl6ZWQpO1xuICAgICAgc2V0RW1haWwoJycpO1xuICAgICAgc2V0VXNlcklkKCcnKTtcbiAgICAgIHNldElzTG9hZGluZyh0cnVlKTtcbiAgICAgIHNldE1mYURldmljZU5hbWUoJycpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBpZFRva2VuID0gYXdhaXQgZ2V0T2lkY1Rva2VuKCk7XG5cbiAgICAgICAgaWYgKCFpZFRva2VuKSB7XG4gICAgICAgICAgY2FwdHVyZSgnU2VlZGxlc3NMb2dpbkZhaWxlZCcpO1xuICAgICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuRmFpbGVkVG9GZXRjaE9pZGNUb2tlbik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGVtYWlsOiBvYnRhaW5lZEVtYWlsLFxuICAgICAgICAgIHVzZXJJZDogb2J0YWluZWRVc2VySWQsXG4gICAgICAgICAgbWZhTWV0aG9kcyxcbiAgICAgICAgfSA9IGF3YWl0IGdldFVzZXJEZXRhaWxzKGlkVG9rZW4pO1xuXG4gICAgICAgIHNldEVtYWlsKG9idGFpbmVkRW1haWwpO1xuICAgICAgICBzZXRVc2VySWQob2J0YWluZWRVc2VySWQpO1xuXG4gICAgICAgIGlmICghb2J0YWluZWRVc2VySWQpIHtcbiAgICAgICAgICBzZXRFcnJvcihBdXRoRXJyb3JDb2RlLk1pc3NpbmdVc2VySWQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9sZCBvbmJvYXJkZ2luIHByb2Nlc3MgZm9yIHNlZWRsZXNzIGRpZCBub3Qgc3RvcmUgdXNlciBJRC4gVGhlIGV4cGVjdGVkVXNlcklkIG1pZ2h0IGJlIG1pc3NpbmdcbiAgICAgICAgaWYgKGV4cGVjdGVkVXNlcklkICYmIGV4cGVjdGVkVXNlcklkICE9PSBvYnRhaW5lZFVzZXJJZCkge1xuICAgICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuTWlzbWF0Y2hpbmdVc2VySWQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGV4cGVjdGVkVXNlcklkIGlzIG5vdCBhdmFpbGFibGUsIHdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIGVtYWlscyBtYXRjaFxuICAgICAgICBpZiAoXG4gICAgICAgICAgIWV4cGVjdGVkVXNlcklkICYmXG4gICAgICAgICAgZXhwZWN0ZWRFbWFpbCAmJlxuICAgICAgICAgIG9idGFpbmVkRW1haWwgIT09IGV4cGVjdGVkRW1haWxcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0RXJyb3IoQXV0aEVycm9yQ29kZS5NaXNtYXRjaGluZ0VtYWlsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRPaWRjVG9rZW4oaWRUb2tlbik7XG4gICAgICAgIGNvbnN0IGF1dGhSZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RPaWRjQXV0aChpZFRva2VuKTtcblxuICAgICAgICBjb25zdCByZXF1aXJlc01mYSA9IGF1dGhSZXNwb25zZS5yZXF1aXJlc01mYSgpO1xuXG4gICAgICAgIGlmICghcmVxdWlyZXNNZmEpIHtcbiAgICAgICAgICBzZXRTdGVwKEF1dGhTdGVwLkNvbXBsZXRlKTtcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IGdldFNpZ25lclRva2VuKGF1dGhSZXNwb25zZSk7XG4gICAgICAgICAgYXdhaXQgb25TaWduZXJUb2tlbk9idGFpbmVkPy4odG9rZW4sIG9idGFpbmVkRW1haWwsIG9idGFpbmVkVXNlcklkKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZmFTZXNzaW9uSW5mbyA9IGF1dGhSZXNwb25zZS5tZmFTZXNzaW9uSW5mbygpO1xuXG4gICAgICAgIGlmIChtZmFTZXNzaW9uSW5mbykge1xuICAgICAgICAgIHNldE1mYUlkKGF1dGhSZXNwb25zZS5tZmFJZCgpKTtcbiAgICAgICAgICBzZXRTZXNzaW9uKGF3YWl0IGdldFNpZ25lclNlc3Npb24obWZhU2Vzc2lvbkluZm8pKTtcblxuICAgICAgICAgIGlmICghbWZhTWV0aG9kcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuTm9NZmFNZXRob2RzQ29uZmlndXJlZCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG1mYU1ldGhvZHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBtZXRob2QgPSBtZmFNZXRob2RzWzBdITtcblxuICAgICAgICAgICAgaWYgKG1ldGhvZC50eXBlID09PSAndG90cCcpIHtcbiAgICAgICAgICAgICAgc2V0U3RlcChBdXRoU3RlcC5Ub3RwQ2hhbGxlbmdlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0aG9kLnR5cGUgPT09ICdmaWRvJykge1xuICAgICAgICAgICAgICBzZXRTdGVwKEF1dGhTdGVwLkZpZG9DaGFsbGVuZ2UpO1xuICAgICAgICAgICAgICBzZXRNZmFEZXZpY2VOYW1lKG1ldGhvZC5uYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuVW5zdXBwb3J0ZWRNZmFNZXRob2QpO1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFN0ZXAoQXV0aFN0ZXAuQ2hvb3NlTWZhTWV0aG9kKTtcbiAgICAgICAgICAgIHNldE1ldGhvZHMobWZhTWV0aG9kcy5tYXAobWFwTWZhc1RvUmVjb3ZlcnlNZXRob2RzKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuTm9NZmFEZXRhaWxzKTtcbiAgICAgICAgICBzZW50cnlDYXB0dXJlRXhjZXB0aW9uKFxuICAgICAgICAgICAgbmV3IEVycm9yKCdNRkEgaXMgcmVxdWlyZWQsIGJ1dCBubyBkZXRhaWxzIHdlcmUgcHJvdmlkZWQnKSxcbiAgICAgICAgICAgIFNlbnRyeUV4Y2VwdGlvblR5cGVzLlNFRURMRVNTLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBzZXRFcnJvcihBdXRoRXJyb3JDb2RlLlVua25vd25FcnJvcik7XG4gICAgICAgIHNlbnRyeUNhcHR1cmVFeGNlcHRpb24oZXJyIGFzIEVycm9yLCBTZW50cnlFeGNlcHRpb25UeXBlcy5TRUVETEVTUyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW1xuICAgICAgc2V0SXNMb2FkaW5nLFxuICAgICAgZ2V0T2lkY1Rva2VuLFxuICAgICAgZ2V0VXNlckRldGFpbHMsXG4gICAgICBjYXB0dXJlLFxuICAgICAgb25TaWduZXJUb2tlbk9idGFpbmVkLFxuICAgIF0sXG4gICk7XG5cbiAgY29uc3QgdmVyaWZ5VG90cENvZGUgPSB1c2VDYWxsYmFjayhcbiAgICBhc3luYyAodG90cENvZGU6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuVW5rbm93bkVycm9yKTtcbiAgICAgICAgc2VudHJ5Q2FwdHVyZUV4Y2VwdGlvbihcbiAgICAgICAgICBuZXcgRXJyb3IoJ1Nlc3Npb24gbm90IGNhcnJpZWQgb3ZlciBmcm9tIGluaXRpYWwgYXV0aGVudGljYXRpb24nKSxcbiAgICAgICAgICBTZW50cnlFeGNlcHRpb25UeXBlcy5TRUVETEVTUyxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgICBzZXRFcnJvcih1bmRlZmluZWQpO1xuXG4gICAgICBsZXQgc3RhdHVzOiBNZmFSZXF1ZXN0SW5mbztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgc3RhdHVzID0gYXdhaXQgc2Vzc2lvbi50b3RwQXBwcm92ZShtZmFJZCwgdG90cENvZGUpO1xuXG4gICAgICAgIGlmICghc3RhdHVzLnJlY2VpcHQ/LmNvbmZpcm1hdGlvbikge1xuICAgICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuVG90cFZlcmlmaWNhdGlvbkVycm9yKTtcbiAgICAgICAgICBjYXB0dXJlKEF1dGhFcnJvckNvZGUuVG90cFZlcmlmaWNhdGlvbkVycm9yKTtcbiAgICAgICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuSW52YWxpZFRvdHBDb2RlKTtcbiAgICAgICAgY2FwdHVyZShBdXRoRXJyb3JDb2RlLkludmFsaWRUb3RwQ29kZSk7XG4gICAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgb2lkY0F1dGhSZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RPaWRjQXV0aChvaWRjVG9rZW4sIHtcbiAgICAgICAgICBtZmFPcmdJZDogcHJvY2Vzcy5lbnYuU0VFRExFU1NfT1JHX0lEIHx8ICcnLFxuICAgICAgICAgIG1mYUlkLFxuICAgICAgICAgIG1mYUNvbmY6IHN0YXR1cy5yZWNlaXB0LmNvbmZpcm1hdGlvbixcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgZ2V0U2lnbmVyVG9rZW4ob2lkY0F1dGhSZXNwb25zZSk7XG5cbiAgICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICAgIGNhcHR1cmUoJ1RvdHBOb1Rva2VuJyk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgICBzZXRFcnJvcihBdXRoRXJyb3JDb2RlLk1pc3NpbmdVc2VySWQpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IG9uU2lnbmVyVG9rZW5PYnRhaW5lZD8uKHRva2VuLCBlbWFpbCwgdXNlcklkKTtcbiAgICAgICAgY2FwdHVyZSgnVG90cFZhcmlkYXRpb25TdWNjZXNzJyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuVW5rbm93bkVycm9yKTtcbiAgICAgICAgY2FwdHVyZSgnVG90cFZhcmlkYXRpb25GYWlsZWQnKTtcbiAgICAgICAgc2VudHJ5Q2FwdHVyZUV4Y2VwdGlvbihlcnIgYXMgRXJyb3IsIFNlbnRyeUV4Y2VwdGlvblR5cGVzLlNFRURMRVNTKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW1xuICAgICAgc2Vzc2lvbixcbiAgICAgIHNldElzTG9hZGluZyxcbiAgICAgIG1mYUlkLFxuICAgICAgY2FwdHVyZSxcbiAgICAgIG9pZGNUb2tlbixcbiAgICAgIHVzZXJJZCxcbiAgICAgIG9uU2lnbmVyVG9rZW5PYnRhaW5lZCxcbiAgICAgIGVtYWlsLFxuICAgIF0sXG4gICk7XG5cbiAgY29uc3QgY29tcGxldGVGaWRvQ2hhbGxlbmdlID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgc2V0RXJyb3IoQXV0aEVycm9yQ29kZS5Vbmtub3duRXJyb3IpO1xuICAgICAgc2VudHJ5Q2FwdHVyZUV4Y2VwdGlvbihcbiAgICAgICAgbmV3IEVycm9yKCdTZXNzaW9uIG5vdCBjYXJyaWVkIG92ZXIgZnJvbSBpbml0aWFsIGF1dGhlbnRpY2F0aW9uJyksXG4gICAgICAgIFNlbnRyeUV4Y2VwdGlvblR5cGVzLlNFRURMRVNTLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgc2V0RXJyb3IodW5kZWZpbmVkKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBjaGFsbGVuZ2UgPSBhd2FpdCBzZXNzaW9uLmZpZG9BcHByb3ZlU3RhcnQobWZhSWQpO1xuXG4gICAgICBsZXQgbWZhSW5mbzogTWZhUmVxdWVzdEluZm87XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIHByb21wdCB0aGUgdXNlciB0byB0YXAgdGhlaXIgRklETyBhbmQgc2VuZCB0aGUgYW5zd2VyIGJhY2sgdG8gQ3ViZVNpZ25lclxuICAgICAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCBsYXVuY2hGaWRvRmxvdyhcbiAgICAgICAgICBGSURPQXBpRW5kcG9pbnQuQXV0aGVudGljYXRlLFxuICAgICAgICAgIGNoYWxsZW5nZS5vcHRpb25zLFxuICAgICAgICApO1xuICAgICAgICBtZmFJbmZvID0gYXdhaXQgY2hhbGxlbmdlLmFuc3dlcihhbnN3ZXIpO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHNldEVycm9yKEF1dGhFcnJvckNvZGUuRmlkb0NoYWxsZW5nZUZhaWxlZCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gcHJpbnQgb3V0IHRoZSBjdXJyZW50IHN0YXR1cyBvZiB0aGUgTUZBIHJlcXVlc3QgYW5kIGFzc2VydCB0aGF0IGl0IGhhcyBiZWVuIGFwcHJvdmVkXG4gICAgICBpZiAoIW1mYUluZm8ucmVjZWlwdCkge1xuICAgICAgICBzZXRFcnJvcihBdXRoRXJyb3JDb2RlLkZpZG9DaGFsbGVuZ2VOb3RBcHByb3ZlZCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gcHJvY2VlZCB3aXRoIHRoZSBNRkEgYXBwcm92YWxcbiAgICAgIGxldCBhdXRoUmVzcG9uc2UgPSBhd2FpdCByZXF1ZXN0T2lkY0F1dGgob2lkY1Rva2VuKTtcblxuICAgICAgYXV0aFJlc3BvbnNlID0gYXdhaXQgYXV0aFJlc3BvbnNlLnNpZ25XaXRoTWZhQXBwcm92YWwoe1xuICAgICAgICBtZmFJZCxcbiAgICAgICAgbWZhT3JnSWQ6IHByb2Nlc3MuZW52LlNFRURMRVNTX09SR19JRCB8fCAnJyxcbiAgICAgICAgbWZhQ29uZjogbWZhSW5mby5yZWNlaXB0LmNvbmZpcm1hdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoYXV0aFJlc3BvbnNlLnJlcXVpcmVzTWZhKCkpIHtcbiAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgc2V0RXJyb3IoQXV0aEVycm9yQ29kZS5Vbmtub3duRXJyb3IpO1xuICAgICAgICBzZW50cnlDYXB0dXJlRXhjZXB0aW9uKFxuICAgICAgICAgIG5ldyBFcnJvcignTUZBIHNob3VsZCBub3QgYmUgcmVxdWlyZWQgYWZ0ZXIgYXBwcm92YWwnKSxcbiAgICAgICAgICBTZW50cnlFeGNlcHRpb25UeXBlcy5TRUVETEVTUyxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICBzZXRFcnJvcihBdXRoRXJyb3JDb2RlLk1pc3NpbmdVc2VySWQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IG9uU2lnbmVyVG9rZW5PYnRhaW5lZD8uKFxuICAgICAgICBhd2FpdCBnZXRTaWduZXJUb2tlbihhdXRoUmVzcG9uc2UpLFxuICAgICAgICBlbWFpbCxcbiAgICAgICAgdXNlcklkLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoQXV0aEVycm9yQ29kZS5Vbmtub3duRXJyb3IpO1xuICAgICAgc2VudHJ5Q2FwdHVyZUV4Y2VwdGlvbihlcnIgYXMgRXJyb3IsIFNlbnRyeUV4Y2VwdGlvblR5cGVzLlNFRURMRVNTKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfSwgW1xuICAgIGVtYWlsLFxuICAgIG1mYUlkLFxuICAgIG9pZGNUb2tlbixcbiAgICBvblNpZ25lclRva2VuT2J0YWluZWQsXG4gICAgc2Vzc2lvbixcbiAgICBzZXRJc0xvYWRpbmcsXG4gICAgdXNlcklkLFxuICBdKTtcblxuICByZXR1cm4ge1xuICAgIGVycm9yLFxuICAgIG9pZGNUb2tlbixcbiAgICBzdGVwLFxuICAgIGVtYWlsLFxuICAgIG1ldGhvZHMsXG4gICAgY2hvb3NlTWZhTWV0aG9kLFxuICAgIGF1dGhlbnRpY2F0ZSxcbiAgICB2ZXJpZnlUb3RwQ29kZSxcbiAgICBjb21wbGV0ZUZpZG9DaGFsbGVuZ2UsXG4gICAgbWZhRGV2aWNlTmFtZSxcbiAgfTtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gbGF1bmNoV2ViQXV0aEZsb3codXJsOiBVUkwpOiBQcm9taXNlPHN0cmluZz4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNocm9tZS5pZGVudGl0eS5sYXVuY2hXZWJBdXRoRmxvdyhcbiAgICAgIHtcbiAgICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgICAgaW50ZXJhY3RpdmU6IHRydWUsXG4gICAgICB9LFxuICAgICAgKHJlZGlyZWN0ZWRUbykgPT4ge1xuICAgICAgICBpZiAoIXJlZGlyZWN0ZWRUbykge1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1JlZGlyZWN0IHVybCBpcyB1bmRlZmluZWQnKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIC8vIEV4YW1wbGU6IEF1dGhvcml6YXRpb24gcGFnZSBjb3VsZCBub3QgYmUgbG9hZGVkLlxuICAgICAgICAgIHJldHVybiByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcnNlZFVybCA9IG5ldyBVUkwocmVkaXJlY3RlZFRvKTtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhwYXJzZWRVcmwuaGFzaC5zbGljZSgxKSk7IC8vIGhhc2ggY29udGFpbnMgYSBxdWVyeSBzdHJpbmdcbiAgICAgICAgY29uc3QgaWRUb2tlbiA9IHBhcmFtcy5nZXQoJ2lkX3Rva2VuJyk7XG5cbiAgICAgICAgaWYgKCFpZFRva2VuKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBpZCB0b2tlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZShpZFRva2VuKTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBsYXVuY2hXZWJBdXRoRmxvdyB9IGZyb20gJy4uLy4uL3BhZ2VzL09uYm9hcmRpbmcvdXRpbHMvbGF1bmNoV2ViQXV0aEZsb3cnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXV0aGVudGljYXRlV2l0aEFwcGxlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IGNsaWVudElkID0gcHJvY2Vzcy5lbnYuQVBQTEVfT0FVVEhfQ0xJRU5UX0lEO1xuICBjb25zdCByZWRpcmVjdFVybCA9IHByb2Nlc3MuZW52LkFQUExFX09BVVRIX1JFRElSRUNUX1VSTDtcblxuICAvLyBUaGlzIGlzIHRoZSBiYXNlIFVSTCB0aGF0IHRoZSBDb3JlIFNlZWRsZXNzIEFQSSBzaG91bGQgcmVkaXJlY3QgdG8gYWZ0ZXIgcmVjZWl2aW5nIHRoZSBkYXRhIGZyb20gQXBwbGUuXG4gIGNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly8nICsgY2hyb21lLnJ1bnRpbWUuaWQgKyAnLmNocm9taXVtYXBwLm9yZyc7XG5cbiAgaWYgKCFjbGllbnRJZCB8fCAhcmVkaXJlY3RVcmwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FwcGxlIE9BdXRoIG5vdCBjb25maWd1cmVkJyk7XG4gIH1cblxuICBjb25zdCB1cmwgPSBuZXcgVVJMKCdodHRwczovL2FwcGxlaWQuYXBwbGUuY29tL2F1dGgvYXV0aG9yaXplJyk7XG5cbiAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ2NsaWVudF9pZCcsIGNsaWVudElkKTtcbiAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ25vbmNlJywgY3J5cHRvLnJhbmRvbVVVSUQoKSk7XG4gIHVybC5zZWFyY2hQYXJhbXMuc2V0KCdyZXNwb25zZV90eXBlJywgJ2NvZGUgaWRfdG9rZW4nKTtcbiAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3N0YXRlJywgYmFzZVVybCk7XG4gIHVybC5zZWFyY2hQYXJhbXMuc2V0KCdyZWRpcmVjdF91cmknLCByZWRpcmVjdFVybCk7XG4gIHVybC5zZWFyY2hQYXJhbXMuc2V0KCdzY29wZScsICdlbWFpbCcpO1xuICAvLyBcImZvcm1fcG9zdFwiIHJlc3BvbnNlIG1vZGUgaXMgZm9yY2VkIHNpbmNlIHdlIHJlcXVlc3QgdXNlcidzIGVtYWlsIGluIFwic2NvcGVcIi5cbiAgLy8gUmVmZXJlbmNlOiBodHRwczovL2RldmVsb3Blci5hcHBsZS5jb20vZG9jdW1lbnRhdGlvbi9zaWduX2luX3dpdGhfYXBwbGUvcmVxdWVzdF9hbl9hdXRob3JpemF0aW9uX3RvX3RoZV9zaWduX2luX3dpdGhfYXBwbGVfc2VydmVyI3F1ZXJ5LXBhcmFtZXRlcnNcbiAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3Jlc3BvbnNlX21vZGUnLCAnZm9ybV9wb3N0Jyk7XG5cbiAgcmV0dXJuIGxhdW5jaFdlYkF1dGhGbG93KHVybCk7XG59XG4iLCJpbXBvcnQgeyBsYXVuY2hXZWJBdXRoRmxvdyB9IGZyb20gJy4uLy4uL3BhZ2VzL09uYm9hcmRpbmcvdXRpbHMvbGF1bmNoV2ViQXV0aEZsb3cnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXV0aGVudGljYXRlV2l0aEdvb2dsZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBtYW5pZmVzdCA9IGNocm9tZS5ydW50aW1lLmdldE1hbmlmZXN0KCk7XG5cbiAgaWYgKCFtYW5pZmVzdC5vYXV0aDIgfHwgIW1hbmlmZXN0Lm9hdXRoMi5zY29wZXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ09hdXRoIG5vdCBjb25maWd1cmVkJyk7XG4gIH1cblxuICBjb25zdCByZWRpcmVjdFVyaSA9ICdodHRwczovLycgKyBjaHJvbWUucnVudGltZS5pZCArICcuY2hyb21pdW1hcHAub3JnJztcbiAgY29uc3QgdXJsID0gbmV3IFVSTCgnaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgnKTtcblxuICB1cmwuc2VhcmNoUGFyYW1zLnNldCgnY2xpZW50X2lkJywgbWFuaWZlc3Qub2F1dGgyLmNsaWVudF9pZCk7XG4gIHVybC5zZWFyY2hQYXJhbXMuc2V0KCdyZXNwb25zZV90eXBlJywgJ2lkX3Rva2VuJyk7XG4gIHVybC5zZWFyY2hQYXJhbXMuc2V0KCdyZWRpcmVjdF91cmknLCByZWRpcmVjdFVyaSk7XG4gIHVybC5zZWFyY2hQYXJhbXMuc2V0KCdzY29wZScsIG1hbmlmZXN0Lm9hdXRoMi5zY29wZXMuam9pbignICcpKTtcblxuICByZXR1cm4gbGF1bmNoV2ViQXV0aEZsb3codXJsKTtcbn1cbiIsImltcG9ydCB7XG4gIEN1YmVTaWduZXJSZXNwb25zZSxcbiAgRW52SW50ZXJmYWNlLFxuICBNZmFSZWNlaXB0LFxuICBOZXdTZXNzaW9uUmVzcG9uc2UsXG4gIE9pZGNDbGllbnQsXG4gIFNpZ25lclNlc3Npb24sXG4gIFNpZ25lclNlc3Npb25EYXRhLFxuICBTaWduZXJTZXNzaW9uTWFuYWdlcixcbiAgZW52cyxcbn0gZnJvbSAnQGN1YmlzdC1sYWJzL2N1YmVzaWduZXItc2RrJztcblxuLyoqXG4gKiBHZXQgdGhlIEN1YmVTaWduZXIgZGVwbG95bWVudCBlbnZpcm9ubWVudCB0byB1c2UuXG4gKlxuICogRGVmYXVsdHMgdG8gJ2dhbW1hJyBidXQgY2FuIGJlIG92ZXJyaWRkZW4gdmlhIHRoZSAnQ1VCRVNJR05FUl9FTlYnIGVudmlyb25tZW50IHZhcmlhYmxlLlxuICpcbiAqIEByZXR1cm4ge0VudkludGVyZmFjZX0gQ3ViZVNpZ25lciBkZXBsb3ltZW50IGVudmlyb25tZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnYoKTogRW52SW50ZXJmYWNlIHtcbiAgcmV0dXJuIGVudnNbcHJvY2Vzcy5lbnYuQ1VCRVNJR05FUl9FTlYgfHwgJ2dhbW1hJ107XG59XG5cbi8qKlxuICogR2V0IHRoZSBJRCBvZiB0aGUgQ3ViZVNpZ25lciBvcmdhbml6YXRpb24gdG8gdXNlLlxuICpcbiAqIE11c3QgYmUgc2V0IHZpYSB0aGUgJ1NFRURMRVNTX09SR19JRCcgZW52aXJvbm1lbnQgdmFyaWFibGUuXG4gKlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgSUQgb2YgdGhlIG9yZ2FuaXphdGlvbiBpbiBDdWJlU2lnbmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3JnSWQoKTogc3RyaW5nIHtcbiAgY29uc3Qgb3JnSWQgPSBwcm9jZXNzLmVudi5TRUVETEVTU19PUkdfSUQ7XG4gIGlmICghb3JnSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NFRURMRVNTX09SR19JRCBtdXN0IGJlIHNldCcpO1xuICB9XG4gIHJldHVybiBvcmdJZDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBDdWJlU2lnbmVyIEFQSSBjbGllbnQgZm9yIG1ldGhvZHMgdGhhdCByZXF1aXJlIE9JREMgYXV0aG9yaXphdGlvbi5cbiAqXG4gKiBUaGlzIGNsaWVudCBjYW4gYmUgdXNlZCB0bzpcbiAqIC0gb2J0YWluIGEgcHJvb2Ygb2YgaWRlbnRpdHkgKHNlZSB7QGxpbmsgT2lkY0NsaWVudC5pZGVudGl0eVByb3ZlfSlcbiAqIC0gb2J0YWluIGEgZnVsbCBDdWJlU2lnbmVyIHNlc3Npb24gKHNlZSB7QGxpbmsgT2lkY0NsaWVudC5zZXNzaW9uQ3JlYXRlfSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2lkY1Rva2VuIFRoZSBPSURDIHRva2VuIHRvIGluY2x1ZGUgaW4gJ0F1dGhvcml6YXRpb24nIGhlYWRlci5cbiAqIEByZXR1cm4ge09pZGNDbGllbnR9IEN1YmVTaWduZXIgQVBJIGNsaWVudCBmb3IgbWV0aG9kcyB0aGF0IHJlcXVpcmUgT0lEQyBhdXRob3JpemF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T2lkY0NsaWVudChvaWRjVG9rZW46IHN0cmluZyk6IE9pZGNDbGllbnQge1xuICByZXR1cm4gbmV3IE9pZGNDbGllbnQoZ2V0RW52KCksIGdldE9yZ0lkKCksIG9pZGNUb2tlbik7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgQ3ViZVNpZ25lciBBUEkgY2xpZW50IGZvciBtZXRob2RzIHRoYXQgcmVxdWlyZSBzaWduZXIgc2Vzc2lvbiBhdXRob3JpemF0aW9uLlxuICpcbiAqIEBwYXJhbSB7TmV3U2Vzc2lvblJlc3BvbnNlIHwgU2lnbmVyU2Vzc2lvbkRhdGF9IHNlc3Npb25JbmZvIFNpZ25lciBzZXNzaW9uIGluZm9ybWF0aW9uXG4gKiAgKGUuZy4sIG9idGFpbmVkIHZpYSB7QGxpbmsgT2lkY0NsaWVudC5zZXNzaW9uQ3JlYXRlfSkgZnJvbSB3aGljaCB0byBjb25zdHJ1Y3QgdGhlIGNsaWVudC5cbiAqIEByZXR1cm4ge1NpZ25lclNlc3Npb259IEN1YmVTaWduZXIgQVBJIGNsaWVudC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNpZ25lclNlc3Npb24oXG4gIHNlc3Npb25JbmZvOiBOZXdTZXNzaW9uUmVzcG9uc2UgfCBTaWduZXJTZXNzaW9uRGF0YSxcbik6IFByb21pc2U8U2lnbmVyU2Vzc2lvbj4ge1xuICByZXR1cm4gbmV3IFNpZ25lclNlc3Npb24oXG4gICAgYXdhaXQgU2lnbmVyU2Vzc2lvbk1hbmFnZXIuY3JlYXRlRnJvbVNlc3Npb25JbmZvKFxuICAgICAgZ2V0RW52KCksXG4gICAgICBnZXRPcmdJZCgpLFxuICAgICAgc2Vzc2lvbkluZm8sXG4gICAgKSxcbiAgKTtcbn1cblxuLyoqXG4gKiBSZXF1ZXN0IGEgbmV3IEN1YmVTaWduZXIgc2Vzc2lvbiBieSBsb2dnaW5nIGluIHZpYSBPSURDLlxuICpcbiAqIFRoZSBuZXcgc2Vzc2lvbiBjYW4gYmUgcGFzc2VkIHRvIHtAbGluayBnZXRTaWduZXJTZXNzaW9ufSB0byBjcmVhdGUgYSBDdWJlU2lnbmVyIEFQSSBjbGllbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG9pZGNUb2tlbiBUaGUgT0lEQyB0b2tlbiB0byBpbmNsdWRlIGluICdBdXRob3JpemF0aW9uJyBoZWFkZXIuXG4gKiBAcGFyYW0ge01mYVJlY2VpcHQgfCB1bmRlZmluZWR9IG1mYVJlY2VpcHQgT3B0aW9uYWwgTUZBIHJlY2VpcHQgdG8gYXR0YWNoIHRvIHRoaXMgcmVxdWVzdC5cbiAqIEByZXR1cm4ge0N1YmVTaWduZXJSZXNwb25zZTxTaWduZXJTZXNzaW9uRGF0YT59IFRoZSByZXNwb25zZS4gSWYgTUZBIGZvciB0aGlzIHJlcXVlc3QgaXNcbiAqICAgcmVxdWlyZWQsIHtAbGluayBDdWJlU2lnbmVyUmVzcG9uc2UucmVxdWlyZXNNZmEoKX0gaXMgc2V0IHRvIHRydWUgYW5kXG4gKiAgIHtAbGluayBDdWJlU2lnbmVyUmVzcG9uc2UubWZhU2Vzc2lvbkluZm8oKX0gY29udGFpbnMgYSB0ZW1wb3Jhcnkgc2Vzc2lvbiB0aGF0IGFsbG93c1xuICogICBhY2Nlc3MgdG8gdGhlIEN1YmVTaWduZXIgTUZBIGVuZHBvaW50czsgb3RoZXJ3aXNlLCB7QGxpbmsgQ3ViZVNpZ25lclJlc3BvbnNlLmRhdGEoKX1cbiAqICAgY29udGFpbnMgdGhlIG5ldyBzZXNzaW9uIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWVzdE9pZGNBdXRoKFxuICBvaWRjVG9rZW46IHN0cmluZyxcbiAgbWZhUmVjZWlwdD86IE1mYVJlY2VpcHQgfCB1bmRlZmluZWQsXG4pOiBQcm9taXNlPEN1YmVTaWduZXJSZXNwb25zZTxTaWduZXJTZXNzaW9uRGF0YT4+IHtcbiAgY29uc3Qgb2lkY0NsaWVudCA9IGdldE9pZGNDbGllbnQob2lkY1Rva2VuKTtcbiAgcmV0dXJuIGF3YWl0IG9pZGNDbGllbnQuc2Vzc2lvbkNyZWF0ZShcbiAgICBbJ3NpZ246KicsICdtYW5hZ2U6KicsICdleHBvcnQ6KiddLFxuICAgIHtcbiAgICAgIC8vIEhvdyBsb25nIHNpbmdpbmcgd2l0aCBhIHBhcnRpY3VsYXIgdG9rZW4gd29ya3MgZnJvbSB0aGUgdG9rZW4gY3JlYXRpb25cbiAgICAgIGF1dGhfbGlmZXRpbWU6IDUgKiA2MCwgLy8gNSBtaW51dGVzXG4gICAgICAvLyBIb3cgbG9uZyBhIHJlZnJlc2ggdG9rZW4gaXMgdmFsaWQsIHRoZSB1c2VyIGhhcyB0byB1bmxvY2sgQ29yZSBpbiB0aGlzIHRpbWVmcmFtZSBvdGhlcndpc2UgdGhleSB3aWxsIGhhdmUgdG8gcmUtbG9naW5cbiAgICAgIC8vIFNlc3Npb25zIGV4cGlyZSBlaXRoZXIgaWYgdGhlIHNlc3Npb24gbGlmZXRpbWUgZXhwaXJlcyBvciBpZiBhIHJlZnJlc2ggdG9rZW4gZXhwaXJlcyBiZWZvcmUgYSBuZXcgb25lIGlzIGdlbmVyYXRlZFxuICAgICAgcmVmcmVzaF9saWZldGltZTogOTAgKiAyNCAqIDYwICogNjAsIC8vIDkwIGRheXNcbiAgICAgIC8vIEhvdyBsb25nIHRpbGwgdGhlIHVzZXIgYWJzb2x1dGVseSBtdXN0IHNpZ24gaW4gYWdhaW5cbiAgICAgIHNlc3Npb25fbGlmZXRpbWU6IDEgKiAzNjUgKiAyNCAqIDYwICogNjAsIC8vIDEgeWVhclxuICAgIH0sXG4gICAgbWZhUmVjZWlwdCxcbiAgKTtcbn1cbiIsImltcG9ydCB7XG4gIEN1YmVTaWduZXIsXG4gIFNpZ25lclNlc3Npb25EYXRhLFxuICBTaWduZXJTZXNzaW9uTWFuYWdlcixcbiAgZW52cyxcbn0gZnJvbSAnQGN1YmlzdC1sYWJzL2N1YmVzaWduZXItc2RrJztcblxuZXhwb3J0IGNvbnN0IGdldFNpZ25lclRva2VuID0gYXN5bmMgKFxuICBvaWRjQXV0aFJlc3BvbnNlOiBBd2FpdGVkPFJldHVyblR5cGU8Q3ViZVNpZ25lclsnb2lkY0xvZ2luJ10+Pixcbik6IFByb21pc2U8U2lnbmVyU2Vzc2lvbkRhdGE+ID0+IHtcbiAgY29uc3Qgc2Vzc2lvbkluZm8gPSBvaWRjQXV0aFJlc3BvbnNlLmRhdGEoKTtcbiAgY29uc3Qgc2Vzc2lvbk1nciA9IGF3YWl0IFNpZ25lclNlc3Npb25NYW5hZ2VyLmNyZWF0ZUZyb21TZXNzaW9uSW5mbyhcbiAgICBlbnZzW3Byb2Nlc3MuZW52LkNVQkVTSUdORVJfRU5WIHx8ICcnXSxcbiAgICBwcm9jZXNzLmVudi5TRUVETEVTU19PUkdfSUQgfHwgJycsXG4gICAgc2Vzc2lvbkluZm8sXG4gICk7XG5cbiAgcmV0dXJuIHNlc3Npb25NZ3Iuc3RvcmFnZS5yZXRyaWV2ZSgpO1xufTtcbiJdLCJuYW1lcyI6WyJNZmFSZXF1ZXN0VHlwZSIsImlzVG9rZW5FeHBpcmVkRXJyb3IiLCJlcnIiLCJFcnJvciIsInN0YXR1cyIsImlzRmFpbGVkTWZhRXJyb3IiLCJtZXNzYWdlIiwiaW5jbHVkZXMiLCJpc0V4cG9ydFJlcXVlc3RPdXRkYXRlZCIsImV4cG9ydFJlcXVlc3QiLCJleHBfZXBvY2giLCJEYXRlIiwibm93IiwibWFwTWZhc1RvUmVjb3ZlcnlNZXRob2RzIiwibWV0aG9kIiwidHlwZSIsIkZpZG8iLCJUb3RwIiwidXNlQ2FsbGJhY2siLCJ1c2VTdGF0ZSIsInNlbnRyeUNhcHR1cmVFeGNlcHRpb24iLCJTZW50cnlFeGNlcHRpb25UeXBlcyIsImdldFNpZ25lclRva2VuIiwiZ2V0T2lkY0NsaWVudCIsImdldFNpZ25lclNlc3Npb24iLCJyZXF1ZXN0T2lkY0F1dGgiLCJsYXVuY2hGaWRvRmxvdyIsIkZJRE9BcGlFbmRwb2ludCIsInVzZUFuYWx5dGljc0NvbnRleHQiLCJBdXRoRXJyb3JDb2RlIiwiQXV0aFN0ZXAiLCJ1c2VTZWVkbGVzc0F1dGgiLCJnZXRPaWRjVG9rZW4iLCJzZXRJc0xvYWRpbmciLCJvblNpZ25lclRva2VuT2J0YWluZWQiLCJvaWRjVG9rZW4iLCJzZXRPaWRjVG9rZW4iLCJzdGVwIiwic2V0U3RlcCIsIk5vdEluaXRpYWxpemVkIiwic2Vzc2lvbiIsInNldFNlc3Npb24iLCJtZmFJZCIsInNldE1mYUlkIiwiZXJyb3IiLCJzZXRFcnJvciIsImVtYWlsIiwic2V0RW1haWwiLCJ1c2VySWQiLCJzZXRVc2VySWQiLCJtZmFEZXZpY2VOYW1lIiwic2V0TWZhRGV2aWNlTmFtZSIsImNhcHR1cmUiLCJtZXRob2RzIiwic2V0TWV0aG9kcyIsImNob29zZU1mYU1ldGhvZCIsIkZpZG9DaGFsbGVuZ2UiLCJuYW1lIiwiVG90cENoYWxsZW5nZSIsIlVuc3VwcG9ydGVkTWZhTWV0aG9kIiwiZ2V0VXNlckRldGFpbHMiLCJpZFRva2VuIiwiY2xpZW50IiwiaWRlbnRpdHkiLCJpZGVudGl0eVByb3ZlIiwibWZhTWV0aG9kcyIsInVzZXJfaW5mbyIsImNvbmZpZ3VyZWRfbWZhIiwic3ViIiwiYXV0aGVudGljYXRlIiwiZXhwZWN0ZWRFbWFpbCIsImV4cGVjdGVkVXNlcklkIiwiSW5pdGlhbGl6ZWQiLCJGYWlsZWRUb0ZldGNoT2lkY1Rva2VuIiwib2J0YWluZWRFbWFpbCIsIm9idGFpbmVkVXNlcklkIiwiTWlzc2luZ1VzZXJJZCIsIk1pc21hdGNoaW5nVXNlcklkIiwiTWlzbWF0Y2hpbmdFbWFpbCIsImF1dGhSZXNwb25zZSIsInJlcXVpcmVzTWZhIiwiQ29tcGxldGUiLCJ0b2tlbiIsIm1mYVNlc3Npb25JbmZvIiwibGVuZ3RoIiwiTm9NZmFNZXRob2RzQ29uZmlndXJlZCIsIkNob29zZU1mYU1ldGhvZCIsIm1hcCIsIk5vTWZhRGV0YWlscyIsIlNFRURMRVNTIiwiVW5rbm93bkVycm9yIiwidmVyaWZ5VG90cENvZGUiLCJ0b3RwQ29kZSIsInVuZGVmaW5lZCIsInRvdHBBcHByb3ZlIiwicmVjZWlwdCIsImNvbmZpcm1hdGlvbiIsIlRvdHBWZXJpZmljYXRpb25FcnJvciIsIkludmFsaWRUb3RwQ29kZSIsIm9pZGNBdXRoUmVzcG9uc2UiLCJtZmFPcmdJZCIsInByb2Nlc3MiLCJlbnYiLCJTRUVETEVTU19PUkdfSUQiLCJtZmFDb25mIiwiY29tcGxldGVGaWRvQ2hhbGxlbmdlIiwiY2hhbGxlbmdlIiwiZmlkb0FwcHJvdmVTdGFydCIsIm1mYUluZm8iLCJhbnN3ZXIiLCJBdXRoZW50aWNhdGUiLCJvcHRpb25zIiwiRmlkb0NoYWxsZW5nZUZhaWxlZCIsIkZpZG9DaGFsbGVuZ2VOb3RBcHByb3ZlZCIsInNpZ25XaXRoTWZhQXBwcm92YWwiLCJsYXVuY2hXZWJBdXRoRmxvdyIsInVybCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2hyb21lIiwidG9TdHJpbmciLCJpbnRlcmFjdGl2ZSIsInJlZGlyZWN0ZWRUbyIsInJ1bnRpbWUiLCJsYXN0RXJyb3IiLCJwYXJzZWRVcmwiLCJVUkwiLCJwYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJoYXNoIiwic2xpY2UiLCJnZXQiLCJhdXRoZW50aWNhdGVXaXRoQXBwbGUiLCJjbGllbnRJZCIsIkFQUExFX09BVVRIX0NMSUVOVF9JRCIsInJlZGlyZWN0VXJsIiwiQVBQTEVfT0FVVEhfUkVESVJFQ1RfVVJMIiwiYmFzZVVybCIsImlkIiwic2VhcmNoUGFyYW1zIiwic2V0IiwiY3J5cHRvIiwicmFuZG9tVVVJRCIsImF1dGhlbnRpY2F0ZVdpdGhHb29nbGUiLCJtYW5pZmVzdCIsImdldE1hbmlmZXN0Iiwib2F1dGgyIiwic2NvcGVzIiwicmVkaXJlY3RVcmkiLCJjbGllbnRfaWQiLCJqb2luIiwiT2lkY0NsaWVudCIsIlNpZ25lclNlc3Npb24iLCJTaWduZXJTZXNzaW9uTWFuYWdlciIsImVudnMiLCJnZXRFbnYiLCJDVUJFU0lHTkVSX0VOViIsImdldE9yZ0lkIiwib3JnSWQiLCJzZXNzaW9uSW5mbyIsImNyZWF0ZUZyb21TZXNzaW9uSW5mbyIsIm1mYVJlY2VpcHQiLCJvaWRjQ2xpZW50Iiwic2Vzc2lvbkNyZWF0ZSIsImF1dGhfbGlmZXRpbWUiLCJyZWZyZXNoX2xpZmV0aW1lIiwic2Vzc2lvbl9saWZldGltZSIsImRhdGEiLCJzZXNzaW9uTWdyIiwic3RvcmFnZSIsInJldHJpZXZlIl0sInNvdXJjZVJvb3QiOiIifQ==