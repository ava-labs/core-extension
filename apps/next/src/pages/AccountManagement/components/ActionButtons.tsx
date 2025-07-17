import { Button, ButtonProps, Stack, styled } from '@avalabs/k2-alpine';
import { FC } from 'react';

type Props = {
  top: ActionButtonProps;
  bottom: ActionButtonProps;
};

type ActionButtonProps = Omit<ButtonProps, 'children'> & {
  label: string;
  panic?: boolean;
};

export const ActionButtons: FC<Props> = ({ top, bottom }) => {
  return (
    <Stack mt="auto" gap={1}>
      <ActionButton {...top} />
      <ActionButton {...bottom} />
    </Stack>
  );
};

const ActionButton: FC<ActionButtonProps> = ({
  label,
  color = 'secondary',
  panic,
  ...props
}) => {
  const isPanicLabel = !props.disabled && panic;
  return (
    <Button variant="contained" size="extension" color={color} {...props}>
      {isPanicLabel ? <PanicButtonText>{label}</PanicButtonText> : label}
    </Button>
  );
};

const PanicButtonText = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
}));
