import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '@src/store/store';

import { Layout } from '@src/components/Layout';
import { ContentLayout } from '@src/styles/styles';

import { Spinner } from '@src/components/misc/Spinner';
import {
  personalSign,
  signTypedData_v4,
  TypedData,
  TypedMessage,
} from 'eth-sig-util';

// ux notes
// elminate tech jargon
// explain why they need to sign (prove wallet ownership / log them in )
// provide hover tooltip explanations
// explain it wont cost anything
// frame message to set expectations

export const SignMessage = observer(() => {
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [parsedMsg, setParsedMsg] = useState('');
  const [stringifiedMsg, setStringifiedMsg] = useState('');
  const [result, setResult] = useState('');

  const { walletStore, transactionStore } = useStore();
  const history = useHistory();

  let jsonRPCId = history.location.search;
  const isUnapprovedTransactionRequest = jsonRPCId !== '';
  if (isUnapprovedTransactionRequest) {
    jsonRPCId = jsonRPCId.replace('?id=', '');
  }

  useEffect(() => {
    (async () => {
      const message = await transactionStore.getUnnaprovedMsgById(
        Number(jsonRPCId)
      );

      if (message !== undefined) {
        let string = JSON.stringify(message.msgParams, [], 4);
        setStringifiedMsg(string);

        setParsedMsg(JSON.parse(message.msgParams));
      }
    })();
  }, []);

  const signTransaction = () => {
    const privateKey = walletStore.getEthPrivateKey();
    if (privateKey) {
      const buffer = Buffer.from(privateKey, 'hex');

      let MsgParams = { data: parsedMsg };
      try {
        const signed = signTypedData_v4(buffer, MsgParams);
        setResult(signed);
      } catch (error) {
        setErrorMsg(error);
      }
    }
  };

  return (
    <Layout>
      <ContentLayout>
        <div className="content">
          <Wrapper>
            <SendDiv>
              {result ? (
                <code> Signed Message: {result}</code>
              ) : (
                <code>{stringifiedMsg}</code>
              )}
            </SendDiv>
          </Wrapper>
        </div>
        <div className="footer half-width">
          <Link to="/wallet">
            <button>Cancel</button>
          </Link>
          <a onClick={signTransaction}>
            <button>Sign</button>
          </a>
        </div>
      </ContentLayout>
    </Layout>
  );
});

export const Wrapper = styled.div`
  padding: 1rem;
`;

export const SendDiv = styled.div`
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;

  code {
    word-break: break-word;
    hyphens: auto;
    overflow-wrap: break-word;
  }

  input {
    width: 100%;
    margin: 1rem auto;
  }
  .token img {
    max-width: 150px;
  }
`;
