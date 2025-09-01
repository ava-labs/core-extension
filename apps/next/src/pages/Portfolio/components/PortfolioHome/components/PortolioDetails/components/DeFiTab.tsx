import { FC } from 'react';
import { MdDeviceHub } from 'react-icons/md';
import { UnderConstruction } from './UnderConstruction';

export const DeFiTab: FC = () => {
  return (
    <UnderConstruction
      title="DeFi"
      description="Your DeFi portfolio will be displayed here. We're working hard to bring you this feature soon!"
      icon={<MdDeviceHub size={24} />}
    />
  );
};
