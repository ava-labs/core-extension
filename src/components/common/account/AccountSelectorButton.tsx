import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import styled, { useTheme } from 'styled-components';

interface AccountSelectorButtonProps {
  onClick?: () => void;
}

const AccountName = styled(Typography)`
  max-width: 165px;
  margin: 0 8px 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
`;

export function AccountSelectorButton({ onClick }: AccountSelectorButtonProps) {
  const theme = useTheme();
  const { activeAccount } = useAccountsContext();
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  return (
    <TextButton data-testid="account-selector-open-button" margin={isMiniMode ? '0' : '0 32px 0 0'} onClick={onClick}>
      <HorizontalFlex align={'center'} padding="0 0 0 8px">
        <AccountName>{activeAccount?.name}</AccountName>
        <CaretIcon
          direction={IconDirection.DOWN}
          color={theme.colors.text1}
          height="12px"
        />
      </HorizontalFlex>
    </TextButton>
  );
}
