import { useState } from 'react';
import { SlippageToolTip } from './SlippageToolTip';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  useTheme,
  styled,
  ChevronUpIcon,
  TextField,
  Grow,
} from '@avalabs/core-k2-components';

interface TransactionDetailsProps {
  fromTokenSymbol: string;
  toTokenSymbol: string;
  rate: number;
  slippage: string;
  setSlippage: (slippage: string) => void;
  setIsOpen?: (isOpen: boolean) => void;
  isTransactionDetailsOpen?: boolean;
}

const isSlippageValid = (value: string) => {
  if ((0 <= parseFloat(value) && parseFloat(value) <= 100) || !value) {
    return true;
  }
  return false;
};

const Container = styled('div')`
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
  slippage,
  setSlippage,
  setIsOpen,
  isTransactionDetailsOpen,
}: TransactionDetailsProps) {
  const { t } = useTranslation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(
    isTransactionDetailsOpen || false,
  );

  const theme = useTheme();

  return (
    <Container>
      <TitleContainer
        onClick={() => {
          setIsDetailsOpen(!isDetailsOpen);
          if (!setIsOpen) {
            return;
          }
          setIsOpen(!isDetailsOpen);
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
            <ChevronUpIcon
              size={21}
              sx={{
                transition: 'transform ease .15s',
                transform: isDetailsOpen ? 'rotateX(0deg)' : 'rotateX(180deg)',
              }}
            />
          </Stack>
        </DetailsRow>
      </TitleContainer>
      <Grow in={isDetailsOpen}>
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
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  const isValid = isSlippageValid(value);
                  if (!isValid) {
                    return;
                  }
                  setSlippage(value);
                }}
              />
            </Stack>
          </Stack>
        </DetailsContainer>
      </Grow>
    </Container>
  );
}
