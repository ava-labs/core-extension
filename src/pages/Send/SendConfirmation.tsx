import {
  PrimaryButton,
  TextButton,
  Typography,
  VerticalFlex,
  LinkIcon,
  ComponentSize,
  useThemeContext,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { useExplorerUrl } from '@src/hooks/useExplorerUrl';

const StyledLinkIcon = styled(LinkIcon)`
  margin: 0 12px 0 0;
`;

const ContainerWithBg = styled(VerticalFlex)<{ isDarkTheme: boolean }>`
  background: ${({ isDarkTheme }) =>
    isDarkTheme
      ? `url(images/illustrations/asset-sent-dark.png)`
      : `url(images/illustrations/asset-sent-light.png)`};
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
`;

export function SendConfirmation({
  txId,
  chain,
  onClose,
}: {
  txId: string;
  chain?: ChainIdType;
  onClose(): void;
}) {
  const { darkMode } = useThemeContext();
  const theme = useTheme();
  const explorerUrl = useExplorerUrl(txId, chain);
  return (
    <ContainerWithBg isDarkTheme={!!darkMode}>
      <VerticalFlex
        grow="1"
        align="center"
        justify="flex-end"
        padding="0 0 80px"
      >
        <Typography size={24} weight={700}>
          Asset sent
        </Typography>
      </VerticalFlex>
      <VerticalFlex height="56px" align="center">
        {explorerUrl && (
          <TextButton as="a" href={explorerUrl} target="_blank">
            <StyledLinkIcon height="16px" color={theme.colors.primary1} />
            View on Explorer
          </TextButton>
        )}
      </VerticalFlex>
      <PrimaryButton size={ComponentSize.LARGE} onClick={() => onClose()}>
        Done
      </PrimaryButton>
    </ContainerWithBg>
  );
}
