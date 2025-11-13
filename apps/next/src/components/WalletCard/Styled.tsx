import {
  accordionSummaryClasses,
  Accordion as K2Accordion,
  AccordionDetails as K2AccordionDetails,
  AccordionSummary as K2AccordionSummary,
  styled,
  typographyClasses,
} from '@avalabs/k2-alpine';
import { MdError } from 'react-icons/md';

export const Accordion = styled(K2Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(0),
  borderRadius: theme.shape.mediumBorderRadius,
  boxShadow: '0px 5px 30px 0px rgba(0, 0, 0, 0.15)',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.surface.primary
      : theme.palette.background.paper,
  overflow: 'visible',
}));

export const AccordionSummary = styled(K2AccordionSummary)(({ theme }) => ({
  [`&.${accordionSummaryClasses.root}`]: {
    minHeight: 42,
    height: 42,
    paddingBlock: theme.spacing(1),
    paddingInline: theme.spacing(1.5),
    justifyContent: 'unset',
    overflow: 'visible',
  },
  '& .accordion-header-container': {
    alignItems: 'center',
    gap: theme.spacing(1),
    [`& > .${typographyClasses.root}`]: {
      width: '100%',
    },
  },
  '& .accordion-header-icon': {
    display: 'flex',
    margin: 0,
    lineHeight: 1,
    overflow: 'visible',
  },
  [`& .${accordionSummaryClasses.content}`]: {
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}`]: {
    color: theme.palette.text.disabled,
  },
}));

export const AccordionDetails = styled(K2AccordionDetails)(({ theme }) => ({
  paddingInline: theme.spacing(1.5),
}));

export const ErrorIcon = styled(MdError)(({ theme }) => ({
  color: theme.palette.error.main,
  flexShrink: 0,
}));

export const Shrinkable = styled('span')(({ theme }) => ({
  width: '100%',
  opacity: 1,
  transition: theme.transitions.create(['width', 'opacity']),

  [`.${accordionSummaryClasses.root}:hover &`]: {
    width: '0%',
    opacity: 0,
  },
}));
