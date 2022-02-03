import {
  HorizontalFlex,
  CaretIcon,
  IconDirection,
  Typography,
  TextButton,
} from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

const BackButton = styled(TextButton)`
  padding: 4px 8px 4px 16px;
`;

export enum PageTitleVariant {
  SECONDARY, // When beneath the global header.
  PRIMARY, // Use this when the global header is hidden and this is the primary page header.
}

type PageTitleMiniModeProps = {
  onBackClick?(): void;
  variant?: PageTitleVariant;
};

export const PageTitleMiniMode = ({
  children,
  onBackClick,
  variant = PageTitleVariant.SECONDARY,
}: PropsWithChildren<PageTitleMiniModeProps>) => {
  const theme = useTheme();
  const history = useHistory();

  return (
    <HorizontalFlex
      align="center"
      position="relative"
      height="53px"
      paddingTop={variant === PageTitleVariant.PRIMARY ? '16px' : undefined}
    >
      <BackButton
        onClick={() => (onBackClick ? onBackClick() : history.goBack())}
      >
        <CaretIcon
          height="20px"
          width="20px"
          color={theme.colors.icon1}
          direction={IconDirection.LEFT}
        />
      </BackButton>
      <Typography weight={500} size={20}>
        {children}
      </Typography>
    </HorizontalFlex>
  );
};
