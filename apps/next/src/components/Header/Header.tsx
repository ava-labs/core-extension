import { useAccountsContext } from '@core/ui';
import { useState } from 'react';
import { HeaderActions } from './components/HeaderActions';
import {
  AccountInfo,
  AccountSelectContainer,
} from './components/styledComponents';
import { ConciergePrompt } from './ConciergePrompt';
import { HeaderAccount } from './components/HeaderAccount';
import { HeaderContainer, HeaderNavigationContainer } from './styled';

export const Header = () => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;

  const [isAIBackdropOpen, setIsAIBackdropOpen] = useState(false);

  return (
    <HeaderContainer>
      <HeaderNavigationContainer
        onMouseEnter={() => {
          setIsAIBackdropOpen(false);
        }}
      >
        <AccountSelectContainer>
          <AccountInfo>
            <HeaderAccount />
          </AccountInfo>
        </AccountSelectContainer>
        <div style={{ flexShrink: 0 }}>
          <HeaderActions account={activeAccount} />
        </div>
      </HeaderNavigationContainer>
      <ConciergePrompt
        isAIBackdropOpen={isAIBackdropOpen}
        setIsAIBackdropOpen={setIsAIBackdropOpen}
      />
    </HeaderContainer>
  );
};
