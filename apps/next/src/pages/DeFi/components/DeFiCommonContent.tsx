import { FC } from 'react';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';

import { Root } from './Styled';

type DeFiCommonContentProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  buttonLabel: string;
};

export const DeFiCommonContent: FC<DeFiCommonContentProps> = ({
  icon,
  title,
  description,
  onClick,
  buttonLabel,
}) => {
  return (
    <Root>
      <Stack
        direction="column"
        gap={1.25}
        height={1}
        alignItems="center"
        justifyContent="center"
      >
        {icon && <Typography fontSize="32px">{icon}</Typography>}
        <Typography variant="body3" fontWeight="bold">
          {title}
        </Typography>
        <Typography
          variant="subtitle4"
          textAlign="center"
          color="text.secondary"
          paddingX={3}
          marginBottom={3}
        >
          {description}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={onClick}
        >
          {buttonLabel}
        </Button>
      </Stack>
    </Root>
  );
};
