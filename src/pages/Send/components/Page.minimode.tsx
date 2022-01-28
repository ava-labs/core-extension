import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

const Container = styled.div`
  position: relative;
  height: 42px;
`;

const BackButton = styled(TextButton)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding: 9px;
`;

export const PageTitleMiniMode = ({
  children,
  onBackClick,
}: PropsWithChildren<{ onBackClick?(): void }>) => {
  const theme = useTheme();
  const history = useHistory();

  return (
    <Container>
      <HorizontalFlex
        justify="center"
        align="center"
        position="relative"
        height="42px"
      >
        <Typography weight={700} size={18}>
          {children}
        </Typography>
      </HorizontalFlex>
      <BackButton
        onClick={() => (onBackClick ? onBackClick() : history.goBack())}
      >
        <CaretIcon
          height="20px"
          color={theme.colors.icon1}
          direction={IconDirection.LEFT}
        />
      </BackButton>
    </Container>
  );
};

export const PageContentMiniMode = (props: any) => (
  <VerticalFlex grow="1" align="center" width="100%" {...props} />
);
