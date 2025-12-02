import { Stack, Typography, TypographyProps } from '@avalabs/k2-alpine';
import { FC } from 'react';

type Props = {
  chainName: string;
  logoUri: string;
  asSelection?: boolean;
};

const selectionSx: TypographyProps['sx'] = {
  maxWidth: '28ch',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

export const NetworkLabel: FC<Props> = ({
  chainName,
  logoUri,
  asSelection,
}) => {
  const variant: TypographyProps['variant'] = asSelection
    ? 'subtitle4'
    : 'body3';
  return (
    <Stack direction="row" columnGap={1} alignItems="center">
      <img src={logoUri} width={16} height={16} alt="" />
      <Typography variant={variant} sx={asSelection ? selectionSx : undefined}>
        {chainName}
      </Typography>
    </Stack>
  );
};
