import {
  StubbyArrowIcon,
  HorizontalFlex,
  IconDirection,
  VerticalFlex,
} from '@avalabs/react-components';
import { SwapExactTokensForTokenDisplayValues } from '@src/contracts/contractParsers/models';
import { useTheme } from 'styled-components';
import { AddressPaths } from './components/AddressPaths';
import { TokenCard } from './components/TokenCard';
import { TransactionHeader } from './components/TransactionHeader';
import { useTranslation } from 'react-i18next';

export function SwapTx({
  path,
  toAddress,
  fromAddress,
}: SwapExactTokensForTokenDisplayValues) {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sentToken = path[0]!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const receivingToken = path[path.length - 1]!;

  const theme = useTheme();

  return (
    <VerticalFlex width="100%">
      <TransactionHeader title={t('Approve Swap')} />

      <VerticalFlex>
        <AddressPaths
          toAddress={toAddress || ''}
          fromAddress={fromAddress || ''}
        />
        {/* Top Token */}
        <TokenCard
          token={sentToken}
          margin={'16px 0 0 0'}
          displayValue={sentToken.amountIn?.value}
          amount={sentToken.amountUSDValue}
        />

        {/* arrow */}
        <HorizontalFlex width={'100%'} justify={'center'} padding={'8px 0'}>
          <StubbyArrowIcon
            height="16px"
            color={theme.colors.icon1}
            direction={IconDirection.DOWN}
          />
        </HorizontalFlex>

        {/* Bottom token */}
        <TokenCard
          token={receivingToken}
          displayValue={receivingToken.amountOut?.value}
          amount={receivingToken.amountUSDValue}
        />
      </VerticalFlex>
    </VerticalFlex>
  );
}
