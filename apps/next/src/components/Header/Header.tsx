import { useAccountsContext, useOnline } from '@core/ui';
import { useState } from 'react';
import { HeaderActions } from './components/HeaderActions';
import {
  AccountInfo,
  AccountSelectContainer,
} from './components/styledComponents';
import { ConciergePrompt } from './ConciergePrompt';
import { HeaderAccount } from './components/HeaderAccount';
import { HeaderContainer, HeaderNavigationContainer } from './styled';
import { OfflineMessage } from './OfflineMessage';

export const Header = ({
  withConciergePrompt = true,
}: {
  withConciergePrompt?: boolean;
}) => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;

  const [isAIBackdropOpen, setIsAIBackdropOpen] = useState(false);
  const { isOnline } = useOnline();
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
      {isOnline && withConciergePrompt && (
        <ConciergePrompt
          isAIBackdropOpen={isAIBackdropOpen}
          setIsAIBackdropOpen={setIsAIBackdropOpen}
        />
      )}
      {!isOnline && <OfflineMessage />}
    </HeaderContainer>
  );
};
