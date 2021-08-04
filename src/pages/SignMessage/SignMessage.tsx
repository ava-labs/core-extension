import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  HorizontalFlex,
  LoadingIcon,
  PrimaryButton,
  SecondaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useGetRequestId } from '../../hooks/useGetRequestId';
import { useGetMessage } from './useGetMessage';
import { SignData } from './components/SignData';
import { SignDataV4 } from './components/SignDataV4';
import { SignDataV3 } from './components/SignDataV3';
import { SignError } from './components/SignError';
import { PersonalSign } from './components/PersonalSign';
import { EthSign } from './components/EthSign';
import { SignedMessageResult, signTransaction } from './utils/signTx';
import { messageService } from '@src/background/services';
import { useWalletContext } from '@src/contexts/WalletProvider';

export const SignMessage = observer(() => {
  const { wallet } = useWalletContext();
  const requestId = useGetRequestId();
  const [error, setError] = useState('');
  const { message } = useGetMessage(requestId);
  const [signedResults, setSignedResults] = useState<SignedMessageResult>();

  if (!message) {
    return <LoadingIcon />;
  }

  if (signedResults) {
    return (
      <VerticalFlex>
        <Typography>status {signedResults.status}</Typography>
        <Typography>message rpc id {signedResults.id}</Typography>
        <Typography>hash {signedResults.result}</Typography>
        <PrimaryButton onClick={() => globalThis.close()}>done</PrimaryButton>
      </VerticalFlex>
    );
  }

  function signTxAndFinalize() {
    message && wallet
      ? signTransaction(message, wallet).then((result) => {
          messageService.updateMessage(result);
          setSignedResults(result);
        })
      : setError(
          'Something is wrong with the message your attempting to sign, or wallet wasnt available'
        );
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
            messageService.removeById(requestId);
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

export default SignMessage;
