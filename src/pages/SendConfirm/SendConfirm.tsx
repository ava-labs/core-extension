import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';
import { observer } from 'mobx-react-lite';

import { useStore } from '@src/store/store';
import { hexToNumber, fromWei } from '@src/utils/web3Utils';

import { Layout } from '@src/components/Layout';
import { ContentLayout } from '@src/styles/styles';

import { truncateAddress } from '@src/utils/addressUtils';
import { Spinner } from '@src/components/misc/Spinner';

interface routeProps {
  address: string;
  amount: string;
  balance: string;
  balanceParsed: string;
  denomination: number;
  name: string;
  recipient: string;
  symbol: string;
}

export const SendConfirm = observer(() => {
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [symbol, setSymbol] = useState('AVAX');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<number | string>(0);

  const { walletStore, transactionStore } = useStore();
  let { routeProps }: any | routeProps = useLocation();
  const history = useHistory();

  let jsonRPCId = history.location.search;
  const isUnconfirmedTransactionRequest = jsonRPCId !== '';
  if (isUnconfirmedTransactionRequest) {
    jsonRPCId = jsonRPCId.replace('?id=', '');
  }

  useEffect(() => {
    (async () => {
      let txParams = await transactionStore.getUnnapprovedTxById(
        Number(jsonRPCId)
      );

      let amount: number | string, to: string;
      if (isUnconfirmedTransactionRequest && txParams !== undefined) {
        amount = hexToNumber(txParams.txParams.value);
        amount = fromWei(amount.toString());
        to = txParams.txParams.to;
      } else {
        amount = routeProps.amount;
        to = routeProps.recipient;
      }

      setAmount(amount);
      setRecipient(to);

      // do logic to determine if AVAX or other token
      // setSymbol(
      //   isUnconfirmedTransactionRequest
      //     ? txParams?.txParams.value
      //     : routeProps.amount
      // );
    })();
  }, []);

  const sendTransaction = async () => {
    setIsLoading(true);

    const data = {
      to: recipient,
      amount: Utils.numberToBN(amount, 18),
      tokenContract: '0xEa81F6972aDf76765Fd1435E119Acc0Aafc80BeA',
    };

    // const data = {
    //   to: '0x254df0daf08669c61d5886bd81c4a7fa59ff7c7e',
    //   amount: Utils.numberToBN('0.0000000000001', 18),
    //   tokenContract: '0xEa81F6972aDf76765Fd1435E119Acc0Aafc80BeA',
    // };
    try {
      await walletStore.sendTransaction(data);
      if (isUnconfirmedTransactionRequest) {
        await transactionStore.removeUnapprovedTransaction(jsonRPCId);
      }
      history.push('/send/success');
    } catch (error) {
      console.log('error', error);
      setErrorMsg(error);
    }
  };

  const truncatedAddress = truncateAddress(recipient);

  return (
    <Layout>
      <ContentLayout>
        <div className="content">
          <Wrapper>
            <SendDiv>
              <div className="token">
                <img
                  src={
                    'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818'
                  }
                  alt=""
                />
              </div>
              <h1>
                Send {amount} {symbol}
              </h1>

              <div>To: ({truncatedAddress})</div>
            </SendDiv>

            {loading && <Spinner />}
          </Wrapper>
        </div>
        <div className="footer half-width">
          <Link to="/wallet">
            <button>Cancel</button>
          </Link>
          <a onClick={sendTransaction}>
            <button>Confirm</button>
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

  input {
    width: 100%;
    margin: 1rem auto;
  }
  .token img {
    max-width: 150px;
  }
`;
