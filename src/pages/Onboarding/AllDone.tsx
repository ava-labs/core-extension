import React from 'react';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  SecondaryButton,
  HorizontalFlex,
  SecondaryIconButton,
  TwitterIcon,
  DiscordIcon,
  TelegramIcon,
  GithubIcon,
  ComponentSize,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import styled from 'styled-components';

const IllustrationPlaceholder = styled(VerticalFlex)`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: ${({ theme }) => theme.palette.grey[800]};
  justify-content: center;
  align-items: center;
`;

export function AllDone() {
  const { setFinalized } = useOnboardingContext();
  return (
    <VerticalFlex
      width="100%"
      align="center"
      padding="22px 0 36px"
      justify="space-between"
    >
      <VerticalFlex align="center">
        <IllustrationPlaceholder>
          <Typography>Illustration</Typography>
        </IllustrationPlaceholder>
      </VerticalFlex>
      <VerticalFlex align="center">
        <Typography as="h1" size={24} weight="bold" margin="28px 0 8px">
          Congratulations!
        </Typography>
        <Typography align="center" margin="0 0 24px" height="24px">
          You have successfully created
          <br />
          your wallet!
        </Typography>
        <PrimaryButton
          size={ComponentSize.LARGE}
          margin="24px 0"
          onClick={() => setFinalized()}
        >
          <Typography size={14} weight={600} color="inherit">
            Enter wallet extension
          </Typography>
        </PrimaryButton>
        <SecondaryButton
          size={ComponentSize.LARGE}
          as="a"
          target="_blank"
          href="https://ecosystem.avax.network"
          onClick={() => setFinalized()}
        >
          <Typography size={14} weight={600} color="inherit">
            Explore Avalanche Ecosystem
          </Typography>
        </SecondaryButton>
        <HorizontalFlex margin="43px 0 0">
          <SecondaryIconButton
            margin="0 23px"
            as="a"
            href="https://twitter.com/avalancheavax"
            rel="noopener noreferrer"
            target="_blank"
          >
            <TwitterIcon />
          </SecondaryIconButton>
          <SecondaryIconButton
            margin="0 23px"
            as="a"
            href="https://chat.avalabs.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <DiscordIcon />
          </SecondaryIconButton>
          <SecondaryIconButton
            margin="0 23px"
            as="a"
            href="https://t.me/avalancheavax"
            rel="noopener noreferrer"
            target="_blank"
          >
            <TelegramIcon />
          </SecondaryIconButton>
          <SecondaryIconButton
            margin="0 23px"
            as="a"
            href="https://github.com/ava-labs"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon />
          </SecondaryIconButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
