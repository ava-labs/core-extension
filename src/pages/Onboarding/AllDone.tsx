import React from 'react';
import {
  VerticalFlex,
  Typography,
  HorizontalSeparator,
  PrimaryButton,
  SecondaryButton,
  HorizontalFlex,
  SecondaryCard,
  IconButton,
  TwitterIcon,
  DiscordIcon,
  TelegramIcon,
  GithubIcon,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import styled from 'styled-components';

const IllustrationPlaceholder = styled(VerticalFlex)`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors?.grey[800]};
  justify-content: center;
  align-items: center;
`;

export function AllDone() {
  const { setFinalized } = useOnboardingContext();
  return (
    <VerticalFlex width="100%" align='center' padding='22px 0 36px' justify="space-between">
      <VerticalFlex align='center'>
        <IllustrationPlaceholder>
          <Typography>Illustration</Typography>
        </IllustrationPlaceholder>
      </VerticalFlex>
      <VerticalFlex align='center'>
        <Typography as="h1" size={24} weight="bold" margin="28px 0 8px">Congratulations!</Typography>
        <Typography align="center" margin="0 0 24px" height="24px">
          You have successfully created<br/>
          your wallet!
        </Typography>    
        <PrimaryButton
          margin="24px 0"
          onClick={() => setFinalized()}
        >
          Enter wallet extension
        </PrimaryButton>
        <SecondaryButton 
          as="a" target="_blank" href="https://ecosystem.avax.network"
          onClick={() => setFinalized()}>
          Explore Avalanche Ecosystem
        </SecondaryButton>
        <HorizontalFlex margin="43px 0 0">
          <IconButton 
            margin="0 23px"
            as="a" 
            href="https://twitter.com/avalancheavax" 
            rel="noopener noreferrer" 
            target="_blank"><TwitterIcon /></IconButton>
          <IconButton
            margin="0 23px"
            as="a" 
            href="https://chat.avalabs.org/" 
            rel="noopener noreferrer" 
            target="_blank"><DiscordIcon /></IconButton>
          <IconButton
            margin="0 23px"
            as="a" 
            href="https://t.me/avalancheavax" 
            rel="noopener noreferrer" 
            target="_blank"><TelegramIcon /></IconButton>
          <IconButton
            margin="0 23px"
            as="a" 
            href="https://github.com/ava-labs" 
            rel="noopener noreferrer" 
            target="_blank"><GithubIcon /></IconButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
