import { useAccountsContext } from '@core/ui';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HeaderActions } from './components/HeaderActions';
import {
  AccountInfo,
  AccountSelectContainer,
} from './components/styledComponents';
import { ConciergePrompt } from './ConciergePrompt';
import { HeaderAccount } from './components/HeaderAccount';
import { HeaderContainer, HeaderNavigationContainer } from './styled';
import { useAccountInfoVisibility } from '@/contexts/AccountInfoVisibilityContext';
import { PersonalAvatar } from '../PersonalAvatar';

export const Header = () => {
  const { accounts } = useAccountsContext();
  const { isAccountInfoVisible } = useAccountInfoVisibility();
  const activeAccount = accounts.active;

  const location = useLocation();
  const [isAIBackdropOpen, setIsAIBackdropOpen] = useState(false);
  const isAccountView =
    location.pathname === '/' ||
    location.pathname === '/portfolio' ||
    location.pathname === '/home';

  return (
    <HeaderContainer>
      <HeaderNavigationContainer
        onMouseEnter={() => {
          setIsAIBackdropOpen(false);
        }}
      >
        <AccountSelectContainer>
          <AccountInfo>
            {isAccountView ? (
              <HeaderAccount isAccountInfoVisible={isAccountInfoVisible} />
            ) : (
              <PersonalAvatar size="xsmall" sx={{ mr: 1 }} />
            )}
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
