import { FC } from 'react';
import { Box, Stack } from '@avalabs/k2-alpine';
import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { styled, Typography } from '@mui/material';

export const LostPhraseLostFundsWarning: FC = () => {
  const { t } = useTranslation();

  return (
    <StyledStack>
      <Box sx={{ width: 24, height: 24 }}>
        <FiAlertCircle size={24} />
      </Box>
      <Typography variant="body2">
        {t('Losing this phrase will result in lost funds')}
      </Typography>
    </StyledStack>
  );
};

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing(2),
  alignItems: 'center',
  color: theme.palette.error.light,
  width: '70%',
  marginTop: theme.spacing(-2),
  marginBottom: theme.spacing(2),
}));
