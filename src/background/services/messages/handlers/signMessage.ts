import { wallet$ } from '@avalabs/wallet-react-components';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { defer, filter, firstValueFrom, map, merge, tap } from 'rxjs';
import {
  addMessage$,
  updateMessage$,
  pendingMessages$,
} from '../../messages/messages';
import { MessageType } from '../../messages/models';
import { TxStatus } from '../../transactions/models';
import { signMessageTx } from '../utils/signMessageTx';

class PersonalSignHandler implements DappRequestHandler {
  constructor(private signType: MessageType) {}

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: `account not available`,
    };
  };

  handleAuthenticated = async (request) => {
    const walletResult = await firstValueFrom(wallet$);

    if (!walletResult) {
      return {
        ...request,
        error: 'wallet undefined',
      };
    }
    addMessage$.next(request);

    const window = await openExtensionNewWindow(
      `sign?id=${request.id}`,
      '',
      request.meta?.coords
    );

    const windowClosed$ = window.removed.pipe(
      map(() => ({
        ...request,
        error: 'Signature rejected by user',
      })),
      tap(() => {
        updateMessage$.next({
          status: TxStatus.ERROR_USER_CANCELED,
          id: request.id,
          error: 'Signature rejected by user',
        });
      })
    );

    const signTx$ = defer(async () => {
      const pendingMessage = await firstValueFrom(
        pendingMessages$.pipe(
          map(
            (currentPendingMessages) => currentPendingMessages[`${request.id}`]
          ),
          filter(
            (pending) => !!pending && pending.status === TxStatus.SUBMITTING
          )
        )
      );

      return signMessageTx(pendingMessage, walletResult)
        .then((result) => {
          updateMessage$.next({
            status: TxStatus.SIGNED,
            id: request.id,
            result,
          });
          return { ...request, result };
        })
        .catch((err) => {
          updateMessage$.next({
            status: TxStatus.ERROR,
            id: request.id,
            error: err?.message ?? err.toString(),
          });
          return { ...request, error: err };
        });
    });

    return firstValueFrom(merge(windowClosed$, signTx$));
  };
}
export const SignRequest: [DAppProviderRequest, DappRequestHandler] = [
  DAppProviderRequest.ETH_SIGN,
  new PersonalSignHandler(MessageType.ETH_SIGN),
];

export const SignTypedDataRequest: [DAppProviderRequest, DappRequestHandler] = [
  DAppProviderRequest.ETH_SIGN_TYPED_DATA,
  new PersonalSignHandler(MessageType.SIGN_TYPED_DATA),
];

export const SignTypedDataV1Request: [DAppProviderRequest, DappRequestHandler] =
  [
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V1,
    new PersonalSignHandler(MessageType.SIGN_TYPED_DATA),
  ];

export const SignTypedDataV3Request: [DAppProviderRequest, DappRequestHandler] =
  [
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3,
    new PersonalSignHandler(MessageType.SIGN_TYPED_DATA_V3),
  ];

export const SignTypedDataV4Request: [DAppProviderRequest, DappRequestHandler] =
  [
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4,
    new PersonalSignHandler(MessageType.SIGN_TYPED_DATA_V4),
  ];

export const PersonalSignRequest: [DAppProviderRequest, DappRequestHandler] = [
  DAppProviderRequest.PERSONAL_SIGN,
  new PersonalSignHandler(MessageType.PERSONAL_SIGN),
];
