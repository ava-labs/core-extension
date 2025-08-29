import { Typography, TypographyProps } from '@avalabs/k2-alpine';

type InfinitySymbolProps = TypographyProps & {
  symbolSize: 'small' | 'large';
};

const PROPS_BY_SIZE: Record<
  InfinitySymbolProps['symbolSize'],
  TypographyProps
> = {
  small: {
    variant: 'h5',
    fontWeight: 400,
  },
  large: {
    variant: 'h2',
    fontWeight: 400,
    fontSize: 64,
    lineHeight: '20px',
    height: 36,
  },
};

export const InfinitySymbol = ({
  symbolSize,
  ...props
}: InfinitySymbolProps) => {
  return (
    <Typography {...PROPS_BY_SIZE[symbolSize]} {...props}>
      ∞
    </Typography>
  );
};
