import { FC } from 'react';
import { Box, Stack, styled, Typography } from '@avalabs/k2-alpine';
import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const RemoveContactWarning: FC = () => {
  const { t } = useTranslation();

  return (
    <StyledStack>
      <Box sx={{ width: 24, height: 24 }}>
        <FiAlertCircle size={24} />
      </Box>
      <Typography variant="body3">
        {t("This action can't be undone")}
      </Typography>
    </StyledStack>
  );
};

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing(2),
  alignItems: 'center',
  color: theme.palette.error.main,
  width: '70%',
  marginTop: theme.spacing(-2),
  marginBottom: theme.spacing(2),
}));
