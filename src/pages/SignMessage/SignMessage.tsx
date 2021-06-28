import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '@src/store/store';

import { Layout } from '@src/components/Layout';
import { ContentLayout } from '@src/styles/styles';

import { Spinner } from '@src/components/misc/Spinner';
import { UnapprovedMessage } from '@src/store/transaction/types';
import { personalSign, signTypedData_v4, signTypedData } from 'eth-sig-util';

// ux notes
// elminate tech jargon
// explain why they need to sign (prove wallet ownership / log them in )
// provide hover tooltip explanations
// explain it wont cost anything
// frame message to set expectations

export const SignMessage = observer(() => {
  const [loading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<UnapprovedMessage>();
  const [errorMsg, setErrorMsg] = useState('');
  const [parsedMsg, setParsedMsg] = useState('');
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
      const message: UnapprovedMessage | undefined =
        await transactionStore.getUnnaprovedMsgById(Number(jsonRPCId));

      setMessage(message);

      if (message !== undefined) {
        if (message.type === 'personal_sign') {
          setParsedMsg(message.msgParams);
        } else if (message.type === 'signTypedData_v3') {
          setParsedMsg(JSON.parse(message.msgParams));
        } else if (message.type === 'signTypedData_v4') {
          setParsedMsg(JSON.parse(message.msgParams));
        }
      }
    })();
  }, []);

  const signTransaction = () => {
    const privateKey = walletStore.getEthPrivateKey();
    if (privateKey) {
      const buffer = Buffer.from(privateKey, 'hex');

      let MsgParams = { data: parsedMsg };

      if (message !== undefined) {
        try {
          let signed;
          if (message.type === 'personal_sign') {
            signed = personalSign(buffer, MsgParams);
          } else if (message.type === 'signTypedData_v4') {
            signed = signTypedData_v4(buffer, MsgParams);
          } else if (message.type === 'signTypedData_v3') {
            signed = signTypedData(buffer, MsgParams);
          }

          setResult(signed);
          transactionStore.updateUnapprovedMsg({
            status: 'signed',
            id: jsonRPCId,
            result: signed,
          });
        } catch (error) {
          setErrorMsg(error);
        }
      }
    }
  };

  const removeUnapprovedMsg = () => {
    transactionStore.removeUnapprovedMessage(jsonRPCId);
  };
  let renderType;

  if (message !== undefined) {
    switch (message.type) {
      case 'personal_sign':
        renderType = renderPersonalSign(parsedMsg);
        break;
      case 'signTypedData':
        renderType = renderDataTypev3(parsedMsg);
        break;
      case 'signTypedData_v3':
        renderType = renderDataTypev3(parsedMsg);
        break;
      case 'signTypedData_v4':
        renderType = renderDataTypev4(parsedMsg);
        break;
      default:
        renderType = renderError();
    }
  }

  console.log('renderType', renderType);

  return (
    <Layout>
      <ContentLayout>
        <div className="content">
          <Wrapper>
            {errorMsg && errorMsg}

            <SendDiv>
              {result ? (
                <code> Signed Message: {result}</code>
              ) : (
                <code>{renderType}</code>
              )}
            </SendDiv>
          </Wrapper>
        </div>
        <div className="footer half-width">
          <Link to="/wallet" onClick={removeUnapprovedMsg}>
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

const renderError = () => {
  return <> Error, malformed request data</>;
};

const renderPersonalSign = (data: any) => {
  return <>{data}</>;
};

const renderDataTypev3 = (data: any) => {
  return (
    <SignatureMessage>
      {data &&
        Object.entries(data).map(([label, value], i) => {
          const padLeft = typeof value !== 'object' || value === null;

          if (label !== 'types') {
            return (
              <div className={padLeft ? 'group' : 'group leaf'} key={i}>
                <span className="label">{label}: </span>
                {typeof value === 'object' && value !== null ? (
                  renderDataTypev3(value)
                ) : (
                  <span className="value">{`${value}`}</span>
                )}
              </div>
            );
          }
        })}
    </SignatureMessage>
  );
};

const renderDataTypev4 = (data: any) => {
  return (
    <SignatureMessage>
      {Object.entries(data).map(([label, value], i) => (
        <div className="group" key={i}>
          <span className="label">{label}: </span>
          {typeof value !== 'object' && value !== null ? (
            renderDataTypev4(value)
          ) : (
            <span className="value">{`${value}`}</span>
          )}
        </div>
      ))}
    </SignatureMessage>
  );
};

export const Wrapper = styled.div`
  padding: 1rem;
`;

export const SignatureMessage = styled.div`
  flex: 1 60%;
  display: flex;
  flex-direction: column;

  span {
    .label {
      padding-bottom: 0.3rem;
    }
  }

  .group {
    display: flex;
    flex-wrap: wrap;
  }
  .group.leaf {
    padding-left: 0.4rem;
  }
`;

export const SendDiv = styled.div`
  margin: auto;
  padding: 2rem;
  text-align: center;

  code {
    word-break: break-word;
    hyphens: auto;
    overflow-wrap: break-word;
  }
  .label {
    font-weight: bold;
  }
  input {
    width: 100%;
    margin: 1rem auto;
  }
  .token img {
    max-width: 150px;
  }
`;
