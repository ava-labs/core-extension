import { FC } from 'react';
import { Box, Stack, StackProps, styled } from '@avalabs/k2-alpine';
import { FiInfo } from 'react-icons/fi';

type Props = StackProps & {
  appName: string;
};

export const InfoBox: FC<Props> = ({ appName, children, ...props }) => (
  <StyledStack {...props}>
    <Box sx={{ width: 24, height: 24 }}>
      <FiInfo size={24} />
    </Box>
    {children}
  </StyledStack>
);

const StyledStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing(2),
  alignItems: 'center',
  marginTop: theme.spacing(-2),
  marginBottom: theme.spacing(2),
}));
