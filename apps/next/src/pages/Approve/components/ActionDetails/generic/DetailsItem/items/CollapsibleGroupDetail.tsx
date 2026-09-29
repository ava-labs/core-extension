import { useState } from 'react';
import {
  ChevronDownIcon,
  Collapse,
  Divider,
  IconButton,
  Stack,
  StackProps,
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
      <GroupHeader onClick={() => setIsOpen((open) => !open)}>
        <Typography variant="subtitle3">{item.label}</Typography>
        <IconButton size="small">
          <GroupIndicator isOpen={isOpen} />
        </IconButton>
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

const GroupHeader = styled((props: StackProps) => (
  <Stack gap={1} role="button" {...props} />
))`
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  justify-content: space-between;
  width: 100%;
  padding-inline: ${({ theme }) => theme.spacing(2)};
  padding-block: ${({ theme }) => theme.spacing(0.5)};
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
