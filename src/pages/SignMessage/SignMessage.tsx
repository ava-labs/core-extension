import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@src/store/store';
import {
  HorizontalFlex,
  LoadingIcon,
  PrimaryButton,
  SecondaryButton,
  VerticalFlex,
} from '@avalabs/react-components';
import { useGetJsonRequestId } from './useGetRequestId';
import { useGetTxMessage } from './useGetTxMessage';
import { SignData } from './components/SignData';
import { SignDataV4 } from './components/SignDataV4';
import { SignDataV3 } from './components/SignDataV3';
import { SignError } from './components/SignError';
import { PersonalSign } from './components/PersonalSign';
import { EthSign } from './components/EthSign';
import { signTransaction } from './utils/signTx';

export const SignMessage = observer(() => {
  const requestId = useGetJsonRequestId();
  const [error, setError] = useState('');
  const { transactionStore } = useStore();
  const { message } = useGetTxMessage(requestId);

  if (!message) {
    return <LoadingIcon />;
  }

  function signTxAndFinalize() {
    message
      ? signTransaction(message).then((result) => {
          transactionStore.updateUnapprovedMsg(result).then(() => {
            window.close();
          });
        })
      : setError('Something is wrong with the message your attempting to sign');
  }

  return (
    <VerticalFlex>
      <VerticalFlex>
        {!error ? (
          <code>
            {
              {
                personal_sign: <PersonalSign message={message.params} />,
                eth_sign: <EthSign data={message.data} />,
                signTypedData: <SignData data={message.data} />,
                signTypedData_v1: <SignData data={message.data} />,
                signTypedData_v3: <SignDataV3 data={message.data} />,
                signTypedData_v4: <SignDataV4 data={message.data} />,
              }[message.type]
            }
          </code>
        ) : (
          <SignError />
        )}
      </VerticalFlex>
      <HorizontalFlex>
        <SecondaryButton
          onClick={() => {
            transactionStore.removeUnapprovedMessage(requestId);
            globalThis.close();
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={() => signTxAndFinalize()}>Sign</PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
});
