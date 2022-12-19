import {
  AvaxTokenIcon,
  BitcoinTokenIcon,
  HorizontalFlex,
  LoadingSpinnerIcon,
  Typography,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

export enum NetworkType {
  AVALANCHE = 'avalanche',
  BITCOIN = 'bitcoin',
}

type DerivedAddressProps = {
  networkType: NetworkType;
  address: string;
  isLoading: boolean;
};

const Container = styled(HorizontalFlex)<{
  hasContent: boolean;
}>`
  background: ${({ theme }) => theme.address.primary.bg};
  padding: ${({ hasContent }) => (hasContent ? '8px 16px' : '18px 16px')};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 0;

  ${Typography} {
    color: ${({ theme }) => theme.address.primary.color};
    word-break: break-all;
  }
`;

export function DerivedAddress({
  networkType,
  address,
  isLoading,
}: DerivedAddressProps) {
  const theme = useTheme();
  const iconStyles = !address
    ? {
        fill: theme.colors.icon2,
        innerFill: theme.address.primary.bg,
      }
    : undefined;

  return (
    <Container hasContent={!!address}>
      {networkType === NetworkType.AVALANCHE ? (
        <AvaxTokenIcon height="16px" {...iconStyles} />
      ) : (
        <BitcoinTokenIcon height="16px" viewBox="2 2 20 20" {...iconStyles} />
      )}
      <HorizontalFlex
        flex={1}
        justify="space-between"
        align="center"
        minHeight="20px"
      >
        <Typography size={14} weight={400} height="20px" margin="0 0 0 8px">
          {address}
        </Typography>
        {isLoading && (
          <HorizontalFlex margin="0 0 0 12px">
            <LoadingSpinnerIcon color={theme.colors.secondary1} height="16px" />
          </HorizontalFlex>
        )}
      </HorizontalFlex>
    </Container>
  );
}
