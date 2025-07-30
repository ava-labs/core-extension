import { FC } from 'react';
import { MdCurrencyBitcoin } from 'react-icons/md';
import { UnderConstruction } from './UnderConstruction';

export const AssetsTab: FC = () => {
  return (
    <UnderConstruction
      title="Assets"
      description="Your assets will be displayed here. We're working hard to bring you this feature soon!"
      icon={<MdCurrencyBitcoin size={24} />}
    />
  );
};
