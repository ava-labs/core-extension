import { useState } from 'react';
import { TokenSelect } from './TokenSelect';
import { SendErrors, TokenWithBalance } from '@avalabs/wallet-react-components';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { ContactInput } from './ContactInput';
import { Contact } from '@src/background/services/contacts/models';
import { SendStateWithActions } from '../models';

type SendFormMiniModeProps = {
  sendState: (SendStateWithActions & { errors: SendErrors }) | null;
  selectedToken?: TokenWithBalance | null;
  amountInput?: BN;
  onAmountInputChange({ amount: string, bn: BN }): void;
  contactInput?: Contact;
  onContactChange(contact?: Contact): void;
  onTokenChange(token: TokenWithBalance): void;
};

export const SendFormMiniMode = ({
  sendState,
  contactInput,
  onContactChange,
  selectedToken,
  onTokenChange,
  amountInput,
  onAmountInputChange,
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
      <TokenSelect
        maxAmount={sendState?.maxAmount}
        selectedToken={selectedToken}
        onTokenChange={onTokenChange}
        inputAmount={amountInput}
        onInputAmountChange={onAmountInputChange}
        onSelectToggle={toggleTokenDropdown}
        isOpen={isTokenSelectOpen}
        error={sendState?.error?.message}
        margin="32px 0"
      />
    </>
  );
};
