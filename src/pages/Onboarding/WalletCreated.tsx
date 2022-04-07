import {
  HorizontalFlex,
  PinIcon,
  PuzzleIcon,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { BetaLabel } from '@src/components/icons/BetaLabel';
import { BrandName } from '@src/components/icons/BrandName';
import { Logo } from '@src/components/icons/Logo';
import styled, { useTheme } from 'styled-components';

const WalletCreatedCard = styled(HorizontalFlex)`
  width: 450px;
  border-radius: ${({ theme }) => theme.borderRadius};
  position: absolute;
  top: 40px;
  right: 40px;
  background: ${({ theme }) => theme.palette.white};
  padding: 16px;
  align-items: center;
`;

export function WalletCreated() {
  const theme = useTheme();

  return (
    <VerticalFlex
      align="center"
      justify="center"
      width="100%"
      height="100%"
      position="relative"
    >
      <WalletCreatedCard>
        <Logo height={34} />
        <VerticalFlex margin="0 0 0 16px" justify="center">
          <Typography
            color={theme.palette.green[700]}
            weight={700}
            size={18}
            height="22px"
            margin="0 0 4px 0"
          >
            Wallet created!
          </Typography>
          <Typography
            color={theme.palette.grey[900]}
            weight={600}
            size={16}
            height="24px"
            margin="0 0 4px 0"
          >
            Pin the Core extension
          </Typography>
          <Typography color={theme.palette.grey[900]} size={16} height="24px">
            Click <PuzzleIcon color={theme.colors.bg1} height="18px" /> and then{' '}
            <PinIcon color={theme.colors.bg1} height="18px" /> for easy wallet
            access.
          </Typography>
        </VerticalFlex>
      </WalletCreatedCard>
      <VerticalFlex>
        <Logo height={150} />
        <BrandName height={58} margin="24px 0 0 0" />
        <HorizontalFlex justify="flex-end" width="100%" margin="10px 0 0 0">
          <BetaLabel />
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
