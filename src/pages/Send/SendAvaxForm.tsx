import {
  Typography,
  VerticalFlex,
  Input,
  PrimaryButton,
  BNInput,
  HorizontalFlex,
  SubTextTypography,
} from '@avalabs/react-components';
import React from 'react';
import { useSendAvax } from './useSendAvax';
import { SendTransactionsList } from './SendTransactionsList';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { getAvaxBalanceUSD } from '../Wallet/utils/balanceHelpers';

export function SendAvaxForm() {
  const { balances, avaxPrice } = useWalletContext();
  const {
    targetChain,
    txId,
    error,
    canSubmit,
    setAmount,
    setAddress,
    amount,
    address,
    submit,
    reset,
    txs,
  } = useSendAvax();

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <br />
      <VerticalFlex>
        <Typography size={14} margin={'0 0 5px 0'}>
          Amount
        </Typography>
        <BNInput
          value={amount as any}
          placeholder="Enter the amount"
          denomination={9}
          onChange={(bigAmount) => setAmount(bigAmount)}
        />
        <HorizontalFlex
          width={'100%'}
          justify={'space-between'}
          align={'center'}
          margin={'5px 0 0 0'}
        >
          <Typography size={14}>$0</Typography>
          <SubTextTypography size={14}>
            Transaction fee: 0.001 AVAX
          </SubTextTypography>
        </HorizontalFlex>
      </VerticalFlex>
      <br />
      <VerticalFlex>
        <Typography size={14} margin={'0 0 5px 0'}>
          Address
        </Typography>
        <Input
          value={address}
          placeholder="Enter the address"
          onChange={(e) => setAddress(e.currentTarget.value)}
        />
      </VerticalFlex>
      {/* <Typography>{targetChain}</Typography> */}
      <br />
      <br />
      <br />
      <br />

      <PrimaryButton onClick={submit} disabled={!canSubmit}>
        Continue
      </PrimaryButton>
      {/* {!txId ? (
        <>
          <Typography>{error}</Typography>

          
        </>
      ) : (
        <PrimaryButton onClick={reset}>Start Again</PrimaryButton>
      )}

      {txs && txs.length ? (
        <VerticalFlex>
          <Typography>
            Additional transactions needed to complete this send transaction.
            The wallet will do these transaction before sending the final
            amount.
          </Typography>

          <SendTransactionsList txs={txs} />
        </VerticalFlex>
      ) : (
        ''
      )} */}
    </VerticalFlex>
  );
}
