import React from 'react';
import {
  HorizontalFlex,
  LoadingIcon,
  PrimaryButton,
  SecondaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useGetRequestId } from '../../hooks/useGetRequestId';
import { SignData } from './components/SignData';
import { SignDataV4 } from './components/SignDataV4';
import { SignDataV3 } from './components/SignDataV3';
import { SignError } from './components/SignError';
import { PersonalSign } from './components/PersonalSign';
import { EthSign } from './components/EthSign';
import { useSignMessage } from './useSignMessage';

export function SignMessage() {
  const requestId = useGetRequestId();
  const { message, error, signMessage, signedResults, cancelSign } =
    useSignMessage(requestId);

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
            cancelSign();
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={() => signMessage()}>Sign</PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}

export default SignMessage;
