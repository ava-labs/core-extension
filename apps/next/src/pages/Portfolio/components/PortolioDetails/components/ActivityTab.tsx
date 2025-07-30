import { FC } from 'react';
import { MdOutlineHistory } from 'react-icons/md';
import { UnderConstruction } from './UnderConstruction';

export const ActivityTab: FC = () => {
  return (
    <UnderConstruction
      title="Activity"
      description={
        "Your transaction history will be displayed here. We're working hard to bring you this feature soon!"
      }
      icon={<MdOutlineHistory size={24} />}
    />
  );
};
