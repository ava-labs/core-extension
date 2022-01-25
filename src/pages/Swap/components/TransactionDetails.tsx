import { BN } from '@avalabs/avalanche-wallet-sdk';
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

interface TransactionDetailsProps {
  fromTokenSymbol?: string;
  toTokenSymbol?: string;
  rate?: number;
  fee?: number | null | string;
  walletFee?: number | null;
  onEdit?: () => void;
  gasLimit?: number;
  gasPrice?: BN;
  slippage?: string;
  setSlippage?: (slippage: string) => void;
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

const EditLink = styled.span`
  cursor: pointer;
`;

export function TransactionDetails({
  fromTokenSymbol,
  toTokenSymbol,
  rate,
  fee,
  walletFee,
  onEdit,
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
          <VerticalFlex>
            <CaretIcon
              height="21px"
              color={theme.colors.text1}
              direction={isDetailsOpen ? IconDirection.UP : IconDirection.DOWN}
            />
          </VerticalFlex>
        </DetailsRow>
      </TitleContainer>
      {isDetailsOpen && (
        <DetailsContent
          fromTokenSymbol={fromTokenSymbol}
          toTokenSymbol={toTokenSymbol}
          rate={rate}
          fee={fee}
          walletFee={walletFee}
          onEdit={onEdit}
          gasLimit={gasLimit}
          gasPrice={gasPrice}
          slippage={slippage}
          setSlippage={setSlippage}
        />
      )}
    </Container>
  );
}

export function DetailsContent({
  fromTokenSymbol,
  toTokenSymbol,
  rate,
  fee,
  walletFee,
  onEdit,
  gasLimit,
  gasPrice,
  slippage,
  setSlippage,
}: TransactionDetailsProps) {
  const theme = useTheme();
  return (
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
      {setSlippage ? (
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
      ) : (
        <DetailsRow>
          <VerticalFlex>
            <HorizontalFlex>
              <Typography margin="0 16px 0 0">Slippage tolerance</Typography>
              <SlippageToolTip />
            </HorizontalFlex>
          </VerticalFlex>
          <VerticalFlex>
            <Typography>{slippage || 0}%</Typography>
          </VerticalFlex>
        </DetailsRow>
      )}
      <DetailsRow>
        <HorizontalFlex align="center">
          <VerticalFlex>
            <HorizontalFlex>
              <Typography size={14} height="17px" margin="0 16px 0 0">
                Network Fee
              </Typography>
              <TransactionFeeTooltip gasPrice={gasPrice} gasLimit={gasLimit} />
            </HorizontalFlex>
            <EditLink>
              <Typography
                size={12}
                color={theme.colors.primary1}
                weight={600}
                onClick={onEdit}
              >
                Edit
              </Typography>
            </EditLink>
          </VerticalFlex>
        </HorizontalFlex>
        `
        <VerticalFlex>
          <Typography>{fee} AVAX</Typography>
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
  );
}
