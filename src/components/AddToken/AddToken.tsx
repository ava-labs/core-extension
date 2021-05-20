import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { Utils } from 'avalanche-wallet-sdk';

import { useStore } from '@src/store/store';

export interface AddTokenProps {}

interface TokenListToken {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number | string;
  logoURI: string;
}

export const AddToken = observer((props: AddTokenProps) => {
  const [contract, setContract] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState(0);
  const [valid, setValid] = useState(false);

  const { walletStore } = useStore();
  const {} = props;
  const handleContractChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setContract(value);

    if (valid) {
      const contract = await walletStore.getERC20ContractData(value);
      const { name, symbol, decimals } = contract;
      setName(name);
      setSymbol(symbol);
      setDecimals(decimals);
    }
  };

  useEffect(() => {
    const isValid = typeof Utils.isValidAddress(contract) === 'boolean';
    console.log('isValid', isValid);

    if (isValid) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [contract]);

  const handleSubmit = () => {
    walletStore.addERC20Contract(contract);
  };

  return (
    <Container>
      <h1>Add Token</h1>

      <label htmlFor="address">Token Contract or Token List</label>
      <input type="text" onChange={handleContractChange} />

      <div className="show">
        {name && name}
        <br />
        {symbol && symbol}
        <br />
        {decimals !== 0 && decimals}
      </div>

      <button disabled={!valid} onClick={handleSubmit}>
        Add Token
      </button>
    </Container>
  );
});

export const Container = styled.div`
  padding: 1rem;
  flex-basis: 100%;
  max-width: 100%;
  display: grid;
  align-items: center;

  .centered {
    text-align: center;
  }
  .cursor {
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
`;
