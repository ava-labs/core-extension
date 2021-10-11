import {
  HorizontalFlex,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
} from '@avalabs/react-components';
import {
  ContractCall,
  SwapExactTokensForTokenDisplayValues,
} from '@src/abi/contractParsers/models';
import { TxStatus } from '@src/background/services/transactions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import React from 'react';
import { SwapExactTokensForTokenTx } from './SwapExactTokensForTokensTx';
import { TxComplete } from './TxComplete';
import { UnknownTx } from './UnknownTx';
import { useGetTransaction } from './useGetTransaction';

export function SignTransactionPage() {
  const requestId = useGetRequestId();
  const { updateTransaction, id, contractType, hash, ...params } =
    useGetTransaction(requestId);

  return (
    <>
      {!hash ? (
        <VerticalFlex>
          {
            {
              [ContractCall.SWAP_EXACT_TOKENS_FOR_TOKEN]: (
                <SwapExactTokensForTokenTx
                  {...(params as unknown as SwapExactTokensForTokenDisplayValues)}
                />
              ),
              ['unknown']: <UnknownTx />,
            }[contractType || 'unknown']
          }
          <br />
          <br />
          <HorizontalFlex width={'100%'} justify={'space-between'}>
            <SecondaryButton
              onClick={() => {
                id &&
                  updateTransaction({
                    status: TxStatus.ERROR_USER_CANCELED,
                    id: id,
                  });
                window.close();
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                id &&
                  updateTransaction({
                    status: TxStatus.SUBMITTING,
                    id: id,
                  });
              }}
            >
              Approve
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      ) : (
        <TxComplete hash={hash} />
      )}
    </>
  );
}

export default SignTransactionPage;
