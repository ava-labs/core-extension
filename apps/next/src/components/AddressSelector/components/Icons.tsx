import { ChevronDownIcon, XPChainIcon } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { IconBaseProps } from 'react-icons';

export const ArrowDownIcon: FC = () => <ChevronDownIcon fontSize={20} />;
export const FixedXPChainIcon: FC<IconBaseProps> = (props) => (
  <XPChainIcon {...props} viewBox="0 0 24 24" />
);
