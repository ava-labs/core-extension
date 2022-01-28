import {
  CaretIcon,
  ComponentSize,
  HorizontalFlex,
  IconDirection,
  Input,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { SlippageToolTip } from './SlippageToolTip';
import { CustomFees } from '@src/components/common/CustomFees';
import { GasPrice } from '@src/background/services/gas/models';

interface TransactionDetailsProps {
  fromTokenSymbol: string;
  toTokenSymbol: string;
  rate: number;
  walletFee: number | null;
  onGasChange: (gasLimit: string, gasPrice: GasPrice) => void;
  gasLimit: string;
  gasPrice: GasPrice;
  slippage: string;
  setSlippage: (slippage: string) => void;
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
  margin: 16px 0;
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
}: TransactionDetailsProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const theme = useTheme();
  return (
    <Container>
      <TitleContainer onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
        <DetailsRow>
          <VerticalFlex>
            <Typography size={16} weight={600}>
              Transaction details
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
            <VerticalFlex>
              <Typography>Rate</Typography>
            </VerticalFlex>
            <VerticalFlex>
              <Typography>
                1 {fromTokenSymbol} ~ {rate?.toFixed(4)} {toTokenSymbol}
              </Typography>
            </VerticalFlex>
          </DetailsRow>
          <DetailsRow>
            <VerticalFlex>
              <HorizontalFlex>
                <Typography margin="0 16px 0 0">Slippage tolerance</Typography>
                <SlippageToolTip />
              </HorizontalFlex>
            </VerticalFlex>
            <VerticalFlex>
              <HorizontalFlex align="center">
                <Input
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
                <Typography margin="0 0 0 8px">%</Typography>
              </HorizontalFlex>
            </VerticalFlex>
          </DetailsRow>
          <DetailsRow>
            <VerticalFlex width="100%">
              <HorizontalFlex marginBottom="8px">
                <Typography size={14} height="17px" margin="0 16px 0 0">
                  Network Fee
                </Typography>
                <TransactionFeeTooltip
                  gasPrice={gasPrice?.bn}
                  gasLimit={gasLimit}
                />
              </HorizontalFlex>
              {gasLimit && gasPrice && (
                <CustomFees
                  gasPrice={gasPrice}
                  limit={gasLimit.toString()}
                  onChange={onGasChange}
                />
              )}
            </VerticalFlex>
          </DetailsRow>
          <DetailsRow>
            <VerticalFlex>
              <Typography size={14} height="17px">
                Avalanche Wallet Fee
              </Typography>
            </VerticalFlex>
            <VerticalFlex>
              <Typography>{walletFee} AVAX</Typography>
            </VerticalFlex>
          </DetailsRow>
        </DetailsContainer>
      )}
    </Container>
  );
}
