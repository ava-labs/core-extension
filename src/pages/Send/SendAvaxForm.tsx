import {
  Typography,
  VerticalFlex,
  Input,
  PrimaryButton,
  BNInput,
  HorizontalFlex,
  SubTextTypography,
  SecondaryButton,
} from '@avalabs/react-components';
import React from 'react';
import { useSendAvax } from './useSendAvax';
import { SendTransactionsList } from './SendTransactionsList';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { getAvaxBalanceUSD } from '../Wallet/utils/balanceHelpers';
import { SendAvaxConfirm } from './SendAvaxConfirm';
import { useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';

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
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <VerticalFlex width={'100%'}>
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
      <br />
      <br />
      <br />
      <SendAvaxConfirm
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        amount={amount as BN}
        address={address as string}
        fee={10}
        extraTxs={txs as any}
        amountUsd={'0'}
        onConfirm={submit}
      />
      <VerticalFlex width={'100%'} align={'center'}>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
        <br />
        <PrimaryButton
          onClick={() => setShowConfirmation(true)}
          disabled={!canSubmit}
        >
          Continue
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
