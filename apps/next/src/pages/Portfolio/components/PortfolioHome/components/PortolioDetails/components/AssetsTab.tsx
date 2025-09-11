import {
  Box,
  Button,
  ButtonProps,
  Stack,
  styled,
  toast,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCurrencyBitcoin, MdKeyboardArrowDown } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { UnderConstruction } from './UnderConstruction';
import { TrendingTokenBanner } from '@/pages/TrendingTokens/components/banner/TrendingTokenBanner';

export const AssetsTab: FC = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  return (
    <Stack direction="column" gap={1.25} height={1}>
      <Box bgcolor="background.paper" borderRadius={2} px={2}>
        <TrendingTokenBanner />
      </Box>
      <Stack direction="row" gap={1.25}>
        <StyledButton
          endIcon={<MdKeyboardArrowDown size={20} />}
          onClick={() => toast.info('Coming soon')}
        >
          {t('Filter')}
        </StyledButton>
        <StyledButton
          endIcon={<MdKeyboardArrowDown size={20} />}
          onClick={() => toast.info('Coming soon')}
        >
          {t('Sort')}
        </StyledButton>
        <Box ml="auto">
          <StyledButton onClick={() => push('/manage-tokens')}>
            {t('Manage')}
          </StyledButton>
        </Box>
      </Stack>
      <UnderConstruction
        title="Assets"
        description="Your assets will be displayed here. We're working hard to bring you this feature soon!"
        icon={<MdCurrencyBitcoin size={24} />}
      />
    </Stack>
  );
};

const StyledButton = styled((buttonProps: ButtonProps) => (
  <Button
    variant="contained"
    color="secondary"
    size="xsmall"
    {...buttonProps}
  />
))(({ theme }) => ({
  paddingInline: theme.spacing(1.5),
}));
