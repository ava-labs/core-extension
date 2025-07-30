import { FC } from 'react';
import { MdOutlineCollections } from 'react-icons/md';
import { UnderConstruction } from './UnderConstruction';

export const CollectiblesTab: FC = () => {
  return (
    <UnderConstruction
      title="Collectibles"
      description="Your collectibles will be displayed here. We're working hard to bring you this feature soon!"
      icon={<MdOutlineCollections size={24} />}
    />
  );
};
