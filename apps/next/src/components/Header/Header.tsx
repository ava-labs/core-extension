import { useAccountsContext } from '@core/ui';
import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HeaderActions } from './components/HeaderActions';
import {
  AccountInfo,
  AccountSelectContainer,
} from './components/styledComponents';
import { ConciergePrompt } from './ConciergePrompt';
import { HeaderAccount } from './components/HeaderAccount';
import { HeaderContainer, HeaderNavigationContainer } from './styled';
import { useHeader } from './hooks/useHeader';
import { PersonalAvatar } from '../PersonalAvatar';

export const Header = () => {
  const { accounts } = useAccountsContext();
  const headerActionsRef = useRef<HTMLDivElement>(null);
  const { headerInfoWidth, isAccountInfoVisible } = useHeader(headerActionsRef);
  const activeAccount = accounts.active;

  const location = useLocation();
  const [isAIBackdropOpen, setIsAIBackdropOpen] = useState(false);

  const isAccountView = location.pathname === `/portfolio`;

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
              <HeaderAccount
                headerInfoWidth={headerInfoWidth}
                isAccountInfoVisible={isAccountInfoVisible}
              />
            ) : (
              <PersonalAvatar size="xsmall" sx={{ mr: 1 }} />
            )}
          </AccountInfo>
        </AccountSelectContainer>
        <div ref={headerActionsRef}>
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
