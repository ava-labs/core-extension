import { useState } from 'react';
import {
  ChevronDownIcon,
  Collapse,
  Divider,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { CollapsibleGroupItem } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';
import { DetailsItem } from '../DetailsItem';

type CollapsibleGroupDetailProps = {
  item: CollapsibleGroupItem;
  network: NetworkWithCaipId;
};

export const CollapsibleGroupDetail = ({
  item,
  network,
}: CollapsibleGroupDetailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Stack width="100%">
      <GroupHeader
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Typography variant="subtitle3">{item.label}</Typography>
        <GroupIndicator isOpen={isOpen} />
      </GroupHeader>
      <Collapse in={isOpen} sx={{ width: '100%' }}>
        <Stack width="100%" divider={<Divider sx={{ mx: 2, my: 0.5 }} />}>
          {item.value.map((section, sectionIndex) => (
            <Stack key={sectionIndex} width="100%">
              {section.title && (
                <Typography variant="subtitle3" px={2} py={0.5}>
                  {section.title}
                </Typography>
              )}
              {section.items.map((sectionItem, index) => (
                <DetailsItem key={index} item={sectionItem} network={network} />
              ))}
            </Stack>
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const GroupHeader = styled('button')`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(1)};
  width: 100%;
  padding-inline: ${({ theme }) => theme.spacing(2)};
  padding-block: ${({ theme }) => theme.spacing(0.5)};
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  text-align: left;
`;

type GroupIndicatorProps = {
  isOpen: boolean;
};

const GroupIndicator = styled(ChevronDownIcon, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<GroupIndicatorProps>(({ isOpen, theme }) => ({
  transition: theme.transitions.create('transform'),
  transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
}));
