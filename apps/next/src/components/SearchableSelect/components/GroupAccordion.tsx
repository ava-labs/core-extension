import {
  Collapse,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa6';
import { FaChevronDown } from 'react-icons/fa6';

import { GroupHeaderProps } from '../types';

type GroupAccordionProps = {
  label: string;
  children: React.ReactNode;
  headerProps: GroupHeaderProps;
};
export const GroupAccordion = ({
  label,
  children,
  headerProps,
}: GroupAccordionProps) => {
  const [isGroupOpen, setIsGroupOpen] = useState(true);

  const { skipHeader, ...restHeaderProps } = headerProps;

  return (
    <ListItem disablePadding>
      <Stack width="100%">
        {!skipHeader && (
          <ListItemButton
            sx={{ height: '40px' }}
            onClick={(ev) => {
              ev.stopPropagation();
              setIsGroupOpen((prev) => !prev);
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') {
                setIsGroupOpen((prev) => !prev);
              }
            }}
            {...restHeaderProps}
          >
            <Stack
              direction="row"
              width="100%"
              alignItems="center"
              gap={1}
              justifyContent="space-between"
              sx={{ background: 'transparent' }}
            >
              <Typography variant="subtitle3" fontWeight="fontWeightSemibold">
                {label}
              </Typography>
              {isGroupOpen ? <FaChevronUp /> : <FaChevronDown />}
            </Stack>
          </ListItemButton>
        )}
        <Collapse
          in={isGroupOpen || skipHeader}
          mountOnEnter
          unmountOnExit
          className="group-accordion-content"
        >
          <Stack py={0.5} component="ul">
            {children}
          </Stack>
        </Collapse>
      </Stack>
    </ListItem>
  );
};
