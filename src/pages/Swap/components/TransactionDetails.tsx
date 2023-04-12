import {
  CaretIcon,
  ComponentSize,
  HorizontalFlex,
  IconDirection,
  Input,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { SlippageToolTip } from './SlippageToolTip';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { BigNumber } from 'ethers';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { useTranslation } from 'react-i18next';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';

interface TransactionDetailsProps {
  fromTokenSymbol: string;
  toTokenSymbol: string;
  rate: number;
  walletFee: number | null;
  onGasChange(values: {
    customGasLimit?: number;
    maxFeePerGas: BigNumber;
    maxPriorityFeePerGas?: BigNumber;
    feeType: GasFeeModifier;
  }): void;
  gasLimit: number;
  gasPrice: BigNumber;
  slippage: string;
  setSlippage: (slippage: string) => void;
  setIsOpen?: (isOpen: boolean) => void;
  maxGasPrice?: string;
  selectedGasFee?: GasFeeModifier;
  isTransactionDetailsOpen?: boolean;
}

const isSlippageValid = (value: string) => {
  if ((0 <= parseFloat(value) && parseFloat(value) <= 100) || !value) {
    return true;
  }
  return false;
};

const Container = styled.div`
  margin-top: 8px;
  margin-bottom: 32px;
`;

const TitleContainer = styled(HorizontalFlex)`
  cursor: pointer;
`;

const DetailsContainer = styled(VerticalFlex)`
  width: 100%;
`;
const DetailsRow = styled(HorizontalFlex)`
  justify-content: space-between;
  width: 100%;
  margin: 8px 0;
  align-items: center;
`;

export function TransactionDetails({
  fromTokenSymbol,
  toTokenSymbol,
  rate,
  walletFee,
  onGasChange,
  gasLimit,
  gasPrice,
  slippage,
  setSlippage,
  setIsOpen,
  maxGasPrice,
  selectedGasFee,
  isTransactionDetailsOpen,
}: TransactionDetailsProps) {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const { networkFee } = useNetworkFeeContext();
  const tokenPrice = useNativeTokenPrice(network);
  const { currencyFormatter } = useSettingsContext();
  const [isDetailsOpen, setIsDetailsOpen] = useState(
    isTransactionDetailsOpen || false
  );

  const theme = useTheme();

  return (
    <Container>
      <TitleContainer
        onClick={() => {
          setIsDetailsOpen(!isDetailsOpen);
          setIsOpen && setIsOpen(!isDetailsOpen);
        }}
      >
        <DetailsRow>
          <VerticalFlex>
            <Typography size={14} height="24px" weight={500}>
              {t('Transaction details')}
            </Typography>
          </VerticalFlex>
          <VerticalFlex width="24px">
            <CaretIcon
              height="21px"
              color={theme.colors.text1}
              direction={isDetailsOpen ? IconDirection.UP : IconDirection.DOWN}
            />
          </VerticalFlex>
        </DetailsRow>
      </TitleContainer>
      {isDetailsOpen && (
        <DetailsContainer>
          <DetailsRow>
            <Typography size={12} height="15px">
              {t('Rate')}
            </Typography>
            <Typography size={14} height="17px" weight={600}>
              1 {fromTokenSymbol} ≈ {rate?.toFixed(4)} {toTokenSymbol}
            </Typography>
          </DetailsRow>
          <DetailsRow>
            <HorizontalFlex>
              <Typography size={12} height="15px" margin="0 8px 0 0">
                {t('Slippage tolerance')}
              </Typography>
              <SlippageToolTip />
            </HorizontalFlex>
            <HorizontalFlex align="center">
              <Input
                data-testid="swap-slippage-tolerance-input"
                size={ComponentSize.SMALL}
                value={slippage}
                width="66px"
                placeholder="0"
                type="number"
                min="0"
                max="100"
                onChange={(e) => {
                  const value = e.target.value;
                  const isValid = isSlippageValid(value);
                  isValid && setSlippage(value);
                }}
              ></Input>
              <Typography margin="0 0 0 8px" size={12} height="15px">
                {t('%')}
              </Typography>
            </HorizontalFlex>
          </DetailsRow>
          <DetailsRow>
            <VerticalFlex width="100%">
              <HorizontalFlex marginBottom="8px">
                <Typography size={12} height="15px" margin="0 8px 0 0">
                  {t('Network Fee')}
                </Typography>
                <TransactionFeeTooltip
                  gasPrice={gasPrice}
                  gasLimit={gasLimit}
                  network={network}
                />
              </HorizontalFlex>
              {gasLimit && gasPrice && (
                <CustomFees
                  gasPrice={gasPrice}
                  limit={gasLimit}
                  onChange={onGasChange}
                  maxGasPrice={maxGasPrice}
                  selectedGasFeeModifier={selectedGasFee}
                  network={network}
                  networkFee={networkFee}
                />
              )}
            </VerticalFlex>
          </DetailsRow>
          <DetailsRow>
            <Typography size={12} height="15px">
              {t('Avalanche Wallet Fee')}
            </Typography>
            <VerticalFlex justify="flex-end">
              <Typography size={14} height="17px" weight={600}>
                {walletFee} AVAX
              </Typography>
              <SubTextTypography size={12} height="15px" margin="4px 0 0">
                {walletFee &&
                  tokenPrice &&
                  currencyFormatter(Number(walletFee) * tokenPrice)}
              </SubTextTypography>
            </VerticalFlex>
          </DetailsRow>
        </DetailsContainer>
      )}
    </Container>
  );
}
