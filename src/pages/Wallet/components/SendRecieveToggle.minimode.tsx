import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { transparentize } from 'polished';
import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
  TextButton,
  ArrowIcon,
  CaretIcon,
  IconDirection,
  SearchIcon,
  SearchInput,
} from '@avalabs/react-components';
import { useHistory } from 'react-router';

const InputField = styled.input`
  font-size: 16px;
  height: 40px;
  padding: 8px 44px;
  display: block;
  box-sizing: border-box;
  width: 100%;
  border-radius: 100px;
  border: none;
  color: ${({ theme }) => theme.inputs.color};
  font-family: ${({ theme }) => theme.fontFamily};
  background: ${({ theme }) => theme.inputs.bg};

  ::placeholder {
    color: ${({ theme }) => theme.inputs.colorPlaceholder};
    opacity: 1; /* Firefox */
    font-weight: 400;
  }

  &:focus {
    outline: none;
  }
`;

const IconCircle = styled(HorizontalFlex)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => transparentize(0.8, theme.palette.white)};
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) =>
      transparentize(0.9, theme.palette.white)};
  }
`;

const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  margin: 0 0 0 16px;
`;

function SendReceiveButton({
  label,
  angle,
  onClick,
}: {
  label: string;
  angle: number;
  onClick(): void;
}) {
  const theme = useTheme();
  return (
    <TextButton margin={'0 0 0 10px'} onClick={() => onClick && onClick()}>
      <VerticalFlex>
        <IconCircle>
          <ArrowIcon
            height={'40px'}
            color={theme.palette.white}
            style={{
              transform: `rotate(${angle}deg)`,
            }}
          />
        </IconCircle>
        <Typography>{label}</Typography>
      </VerticalFlex>
    </TextButton>
  );
}

export function SendReceiveToggle({
  onSearch,
}: {
  onSearch(term: string): void;
}) {
  const [showSend, setShowSend] = useState(false);
  const history = useHistory();
  const theme = useTheme();

  if (showSend) {
    return (
      <VerticalFlex width={'100%'} align={'center'}>
        <HorizontalFlex width={'100%'} justify={'center'}>
          <TextButton
            onClick={() => {
              setShowSend(false);
              onSearch && onSearch('');
            }}
            style={{ position: 'fixed', left: '10px' }}
          >
            <CaretIcon
              color={theme.palette.white}
              direction={IconDirection.LEFT}
            />
          </TextButton>
          <Typography as="h1" size={29} weight={600} margin={'0 0 10px 0'}>
            Send
          </Typography>
        </HorizontalFlex>
        <Typography>Choose asset to continue</Typography>
        <br />
        <SearchInput onSearch={(query) => onSearch(query)} autoFocus={true} />
      </VerticalFlex>
    );
  }

  return (
    <VerticalFlex>
      <HorizontalFlex width={'100%'} justify={'center'} align={'center'}>
        <SendReceiveButton
          label={'Send'}
          angle={320}
          onClick={() => setShowSend(true)}
        />
        <SendReceiveButton
          label={'Receive'}
          angle={140}
          onClick={() => history.push('/receive')}
        />
      </HorizontalFlex>
    </VerticalFlex>
  );
}
