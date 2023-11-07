import { ConfirmMnemonic } from './ConfirmMnemonic';
import { ShowMnemonic } from './ShowMnemonic';

export interface MnemonicProps {
  phrase: string;
  wordCount?: number;
  confirmWordCount?: number;
  confirmMnemonic?: boolean;
  onConfirmedChange?: (confirmed: boolean) => void;
}

export function Mnemonic(props: MnemonicProps) {
  return props.confirmMnemonic ? (
    <ConfirmMnemonic {...props} />
  ) : (
    <ShowMnemonic {...props} />
  );
}
