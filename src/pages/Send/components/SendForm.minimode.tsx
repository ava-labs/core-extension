import { useState } from 'react';
import { TokenSelect } from './TokenSelect';
import { SendErrors, TokenWithBalance } from '@avalabs/wallet-react-components';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { ContactInput } from './ContactInput';
import { Contact } from '@src/background/services/contacts/models';
import { SendStateWithActions } from '../models';
import { HorizontalFlex } from '@avalabs/react-components';

const FALLBACK_MAX = new BN(0);

type SendFormMiniModeProps = {
  sendState: (SendStateWithActions & { errors: SendErrors }) | null;
  contactInput?: Contact;
  onContactChange(contact?: Contact): void;
  selectedToken?: TokenWithBalance | null;
  onTokenChange(token: TokenWithBalance): void;
  amountInput?: BN;
  onAmountInputChange({ amount: string, bn: BN }): void;
  tokensWBalances: TokenWithBalance[];
};

export const SendFormMiniMode = ({
  sendState,
  contactInput,
  onContactChange,
  selectedToken,
  onTokenChange,
  amountInput,
  onAmountInputChange,
  tokensWBalances,
}: SendFormMiniModeProps) => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);

  const toggleContactsDropdown = (to?: boolean) => {
    setIsContactsOpen(to === undefined ? !isContactsOpen : to);
    setIsTokenSelectOpen(false);
  };

  const toggleTokenDropdown = () => {
    setIsTokenSelectOpen(!isTokenSelectOpen);
    setIsContactsOpen(false);
  };

  return (
    <>
      <ContactInput
        contact={contactInput}
        onChange={onContactChange}
        isContactsOpen={isContactsOpen}
        toggleContactsDropdown={toggleContactsDropdown}
      />
      <HorizontalFlex padding="0 16px" width="100%">
        <TokenSelect
          maxAmount={
            sendState?.maxAmount || selectedToken?.balance || FALLBACK_MAX
          }
          tokensList={tokensWBalances}
          selectedToken={selectedToken}
          onTokenChange={onTokenChange}
          inputAmount={amountInput}
          onInputAmountChange={onAmountInputChange}
          onSelectToggle={toggleTokenDropdown}
          isOpen={isTokenSelectOpen}
          error={sendState?.error?.message}
          margin="24px 0"
        />
      </HorizontalFlex>
    </>
  );
};
