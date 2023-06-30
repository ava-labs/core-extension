import { useState } from 'react';
import { SlippageToolTip } from './SlippageToolTip';
import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import {
  Stack,
  Typography,
  useTheme,
  styled,
  ChevronUpIcon,
  ChevronDownIcon,
  TextField,
} from '@avalabs/k2-components';
import {
  CustomFeesK2,
  GasFeeModifier,
} from '@src/components/common/CustomFeesK2';

interface TransactionDetailsProps {
  fromTokenSymbol: string;
  toTokenSymbol: string;
  rate: number;
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

const Container = styled('div')`
  margin-top: 8px;
  margin-bottom: 32px;
`;

const TitleContainer = styled(Stack)`
  flex-direction: row;
  cursor: pointer;
`;

const DetailsContainer = styled(Stack)`
  width: 100%;
`;
const DetailsRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 8px 0;
  align-items: center;
`;

export function TransactionDetails({
  fromTokenSymbol,
  toTokenSymbol,
  rate,
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
          <Stack>
            <Typography
              variant="body2"
              sx={{ fontWeight: theme.typography.fontWeightMedium }}
            >
              {t('Transaction details')}
            </Typography>
          </Stack>
          <Stack sx={{ width: '24px' }}>
            {isDetailsOpen ? (
              <ChevronUpIcon size={21} />
            ) : (
              <ChevronDownIcon size={21} />
            )}
          </Stack>
        </DetailsRow>
      </TitleContainer>
      {isDetailsOpen && (
        <DetailsContainer>
          <DetailsRow>
            <Typography
              variant="body2"
              sx={{ fontWeight: theme.typography.fontWeightSemibold }}
            >
              {t('Rate')}
            </Typography>
            <Typography variant="body2">
              1 {fromTokenSymbol} ≈ {rate?.toFixed(4)} {toTokenSymbol}
            </Typography>
          </DetailsRow>
          <Stack>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  my: 0,
                  mr: 1,
                  ml: 0,
                  fontWeight: theme.typography.fontWeightSemibold,
                }}
              >
                {t('Slippage tolerance')}
              </Typography>
              <SlippageToolTip />
            </Stack>
            <Stack
              sx={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}
            >
              <TextField
                data-testid="swap-slippage-tolerance-input"
                size={'small'}
                value={slippage}
                placeholder="Input Percent %"
                fullWidth
                type="number"
                min="0"
                max="100"
                onChange={(e) => {
                  const value = e.target.value;
                  const isValid = isSlippageValid(value);
                  isValid && setSlippage(value);
                }}
              />
            </Stack>
          </Stack>
          <DetailsRow sx={{ mt: 5 }}>
            <Stack sx={{ width: '100%' }}>
              {gasLimit && gasPrice && (
                <CustomFeesK2
                  maxFeePerGas={gasPrice}
                  limit={gasLimit}
                  onChange={onGasChange}
                  maxGasPrice={maxGasPrice}
                  selectedGasFeeModifier={selectedGasFee}
                  network={network}
                  networkFee={networkFee}
                />
              )}
            </Stack>
          </DetailsRow>
        </DetailsContainer>
      )}
    </Container>
  );
}
