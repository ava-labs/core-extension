import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  AntWithBalance,
  sendAntCheckFormAndCalculateFees,
  wallet$,
  walletState$,
} from '@avalabs/wallet-react-components';
import { firstValueFrom, of, startWith, Subject, tap } from 'rxjs';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';

async function validateSendAntState(request: ExtensionConnectionMessage) {
  const params = request.params || [];
  const [amount, address, token] = params;
  const walletState = await firstValueFrom(walletState$);

  const result = await firstValueFrom(
    sendAntCheckFormAndCalculateFees(
      of(
        Utils.stringToBN(
          amount || 0,
          (token as AntWithBalance).denomination || 9
        )
      ).pipe(startWith(new BN(0))) as Subject<BN>,
      of(address).pipe(startWith('')) as Subject<string>,
      of(
        /**
         * Need to get the original token here because the passed in token is serialized. The BN
         * is turned into a hex. We could either convert back to BN or get original.
         */
        walletState?.antTokens.find(
          (antToken) => (token as AntWithBalance).assetID === antToken.assetID
        )
      ) as Subject<AntWithBalance>,
      wallet$
    )
  );
  return { ...request, result };
}

export const ValidateSendAntStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_ANT_VALIDATE, validateSendAntState];
