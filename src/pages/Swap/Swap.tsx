import {
  VerticalFlex,
  TokenSearch,
  Typography,
  HorizontalFlex,
  PrimaryButton,
  SecondaryButton,
  BNInput,
  LoadingIcon,
} from '@avalabs/react-components';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { BottomNav } from '@src/components/common/BottomNav.minimode';
import { useSwapContext } from '@src/contexts/SwapProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { OptimalRate } from 'paraswap-core';
import React, { useEffect, useMemo, useState } from 'react';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { toPrecision } from '@src/utils/number';
import { useTheme } from 'styled-components';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { resolve } from '@src/utils/promiseResolver';
import { truncateAddress } from '@src/utils/truncateAddress';

export function Swap() {
  const { erc20Tokens, avaxToken } = useWalletContext();
  const { getRate, swap } = useSwapContext();
  const { currencyFormatter, currency } = useSettingsContext();
  const theme = useTheme();
  const tokensWBalances = useTokensWithBalances();
  const [selectedFromToken, setSelectedFromToken] =
    useState<TokenWithBalance>();
  const [selectedToToken, setSelectedToToken] = useState<TokenWithBalance>();
  const [optimalRate, setOptimalRate] = useState<OptimalRate>();
  const [loading, setLoading] = useState<boolean>(false);
  const [txInProgress, setTxInProgress] = useState(false);
  const [txHash, setTxHash] =
    useState<{ swapTxHash: string; approveTxHash?: string }>();
  const [txError, setTxError] = useState<string>();
  const destAmount = useMemo(() => {
    if (!selectedToToken || !optimalRate) return;

    if (!optimalRate.destAmount) return;

    const bn = Utils.stringToBN((optimalRate?.destAmount as string) || '0', 0);

    if (bn.isZero() || bn.lt(new BN(0))) return;

    return toPrecision(
      Utils.bnToBig(bn, (selectedFromToken as any).decimals).toString()
    );
  }, [optimalRate?.destAmount]);

  const setValuesDebouncedSubject = useMemo(() => {
    return new BehaviorSubject<{
      amount?: string;
      toTokenAddress?: string;
      fromTokenAddress?: string;
      toTokenDecimals?: number;
      fromTokenDecimals?: number;
    }>({});
  }, []);

  useEffect(() => {
    const subscription = setValuesDebouncedSubject
      .pipe(debounceTime(500))
      .subscribe(
        ({
          amount,
          toTokenAddress,
          fromTokenAddress,
          toTokenDecimals,
          fromTokenDecimals,
        }) => {
          if (
            amount &&
            toTokenAddress &&
            fromTokenAddress &&
            fromTokenDecimals &&
            toTokenDecimals
          ) {
            setLoading(true);
            setOptimalRate(undefined);
            getRate(
              fromTokenAddress,
              toTokenAddress,
              fromTokenDecimals,
              toTokenDecimals,
              amount
            ).then((rate) => {
              /**
               * This can be an error, the bacground tries 10x but if the
               * server is still "busy" it sends the error
               */
              setOptimalRate(rate);
              setLoading(false);
            });
          } else {
            setOptimalRate(undefined);
          }
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function onHandleSwap() {
    setTxInProgress(true);
    const {
      amount,
      toTokenAddress,
      fromTokenAddress,
      toTokenDecimals,
      fromTokenDecimals,
    } = setValuesDebouncedSubject.getValue();
    const [result, error] = await resolve(
      swap(
        fromTokenAddress as string,
        toTokenAddress as string,
        toTokenDecimals as number,
        fromTokenDecimals as number,
        amount as string,
        optimalRate as OptimalRate,
        optimalRate?.destAmount,
        optimalRate?.gasCost as string
      )
    );
    setTxInProgress(false);
    txError ? setTxError(error) : setTxHash(result);
  }

  function onHandleCancel() {
    setSelectedFromToken(undefined);
    setSelectedToToken(undefined);
    setOptimalRate(undefined);
    setLoading(false);
    setTxInProgress(false);
    setTxHash(undefined);
    setTxError(undefined);
    setValuesDebouncedSubject.next({});
  }

  if (txInProgress) {
    return (
      <HorizontalFlex>
        <LoadingIcon color={theme.palette.white} />
      </HorizontalFlex>
    );
  }

  if (txError) {
    return (
      <HorizontalFlex>
        <Typography>{txError}</Typography>
      </HorizontalFlex>
    );
  }

  if (txHash) {
    return (
      <VerticalFlex width={'100%'} justify={'center'} align={'center'}>
        {txHash.approveTxHash ? (
          <>
            <Typography>Approval Tx</Typography>
            <Typography>{truncateAddress(txHash.approveTxHash)}</Typography>
            <br />
            <br />
          </>
        ) : (
          ''
        )}
        <Typography>Swap Tx</Typography>
        <Typography>{truncateAddress(txHash.swapTxHash)}</Typography>
        <br />
        <br />
        <HorizontalFlex>
          <PrimaryButton onClick={() => onHandleCancel()}>
            That was fun lets do it again
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    );
  }

  return (
    <VerticalFlex>
      <br />
      <br />
      <HorizontalFlex width="100%" justify="center">
        <Typography size={18} weight={600}>
          Swap
        </Typography>
      </HorizontalFlex>
      <br />
      <br />
      <br />
      <HorizontalFlex width="100%" justify="space-between">
        <Typography>From</Typography>
        <Typography>
          Balance {selectedFromToken?.balanceDisplayValue}
        </Typography>
      </HorizontalFlex>
      <br />
      <TokenSearch
        onSelect={(item) => {
          setSelectedFromToken(item as TokenWithBalance);
          const token: any = item;
          setValuesDebouncedSubject.next({
            ...setValuesDebouncedSubject.getValue(),
            fromTokenAddress: token.address,
            fromTokenDecimals: token.decimals,
          });
        }}
        items={tokensWBalances}
        value={selectedFromToken}
        placeholder="Search"
      />
      <br />
      <BNInput
        denomination={selectedFromToken?.denomination as number}
        onChange={(val) =>
          setValuesDebouncedSubject.next({
            ...setValuesDebouncedSubject.getValue(),
            amount: Utils.stringToBN(
              val.amount,
              (selectedFromToken as any).decimals
            ).toString(),
          })
        }
      />
      <br />
      <br />
      <HorizontalFlex width="100%" justify="space-between">
        <Typography>To</Typography>
        <Typography>Balance {selectedToToken?.balanceDisplayValue}</Typography>
      </HorizontalFlex>
      <br />
      <TokenSearch
        onSelect={(item) => {
          setSelectedToToken(item as TokenWithBalance);
          const token: any = item;
          setValuesDebouncedSubject.next({
            ...setValuesDebouncedSubject.getValue(),
            toTokenAddress: token.address,
            toTokenDecimals: token.decimals,
          });
        }}
        items={[...erc20Tokens, avaxToken]}
        value={selectedToToken}
        placeholder="Search"
      />
      {optimalRate ? (
        <>
          <br />
          <br />
          <VerticalFlex>
            <HorizontalFlex
              width={'100%'}
              justify={'space-between'}
              align={'center'}
              margin={'0 0 8px 0'}
            >
              <Typography>Estimated Cost</Typography>
              <Typography>
                {currencyFormatter(Number(optimalRate?.gasCostUSD) ?? '0.00')}{' '}
                {currency}
              </Typography>
            </HorizontalFlex>
            <HorizontalFlex
              width={'100%'}
              justify={'space-between'}
              align={'center'}
              margin={'0 0 8px 0'}
            >
              <Typography>Price Impact</Typography>
              <Typography>{'need value'}</Typography>
            </HorizontalFlex>
            <HorizontalFlex
              width={'100%'}
              justify={'space-between'}
              align={'center'}
              margin={'0 0 8px 0'}
            >
              <Typography>Minimum Received</Typography>
              <Typography>
                {destAmount} {selectedToToken?.symbol}
              </Typography>
            </HorizontalFlex>
            <HorizontalFlex
              width={'100%'}
              justify={'space-between'}
              align={'center'}
            >
              <Typography>Avalanche Fee</Typography>
              <Typography>
                {'need value'} {avaxToken.symbol}
              </Typography>
            </HorizontalFlex>
          </VerticalFlex>
          <br />
          <br />
        </>
      ) : loading ? (
        <HorizontalFlex width={'100%'} justify={'center'}>
          <LoadingIcon color={theme.palette.white} />
        </HorizontalFlex>
      ) : (
        ''
      )}
      <HorizontalFlex
        flex={1}
        align={'flex-end'}
        padding={'0 0 90px 0'}
        justify={'space-around'}
      >
        <SecondaryButton onClick={() => onHandleCancel()}>
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={() => onHandleSwap()}>Swap</PrimaryButton>
      </HorizontalFlex>
      <BottomNav />
    </VerticalFlex>
  );
}

export default Swap;
