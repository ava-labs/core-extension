import {
  HorizontalFlex,
  PlusIcon,
  VerticalFlex,
} from '@avalabs/react-components';
import { AddLiquidityDisplayData } from '@src/contracts/contractParsers/models';
import { Fragment } from 'react';
import { useTheme } from 'styled-components';
import { AddressPaths } from './components/AddressPaths';
import { TokenCard } from './components/TokenCard';
import { TransactionHeader } from './components/TransactionHeader';
import { useTranslation } from 'react-i18next';

export function AddLiquidityTx({
  poolTokens,
  toAddress,
  fromAddress,
}: AddLiquidityDisplayData) {
  const { t } = useTranslation();
  const theme = useTheme();

  const plusIcon = (
    <HorizontalFlex width={'100%'} justify={'center'} margin="8px 0">
      <PlusIcon color={theme.colors.icon1} height="16px" />
    </HorizontalFlex>
  );

  return (
    <VerticalFlex width={'100%'}>
      <TransactionHeader title={t('Adding Liquidity to Pool')} />

      <VerticalFlex>
        {/* Account */}
        <AddressPaths
          toAddress={toAddress || ''}
          fromAddress={fromAddress || ''}
        />

        {/* Tokens */}
        {poolTokens.map((token, index) => (
          <Fragment key={token.symbol}>
            <TokenCard
              token={token}
              margin={`${!index && '16px 0 0 0'}`}
              displayValue={token.amountDepositedDisplayValue}
              amount={token.amountUSDValue}
            />
            {!index && plusIcon}
          </Fragment>
        ))}
      </VerticalFlex>
    </VerticalFlex>
  );
}
