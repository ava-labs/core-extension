import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import React from 'react';
import styled, { useTheme } from 'styled-components';

interface AccountSelectorButtonProps {
  onClick?: () => void;
}

const AccountName = styled(Typography)`
  max-width: 165px;
  margin: 0 8px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 600;
`;

export function AccountSelectorButton({ onClick }: AccountSelectorButtonProps) {
  const theme = useTheme();
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  return (
    <TextButton margin={isMiniMode ? '0' : '0 32px 0 0'} onClick={onClick}>
      <HorizontalFlex align={'center'} padding="0 16px">
        <AccountName>Account</AccountName>
        <CaretIcon
          direction={IconDirection.DOWN}
          color={theme.colors.text1}
          height="12px"
        />
      </HorizontalFlex>
    </TextButton>
  );
}
