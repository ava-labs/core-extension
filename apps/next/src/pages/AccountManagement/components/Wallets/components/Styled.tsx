import {
  AccordionSummary,
  accordionSummaryClasses,
  Accordion as K2Accordion,
  styled,
  typographyClasses,
} from '@avalabs/k2-alpine';
import { MdError } from 'react-icons/md';

export const Accordion = styled(K2Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(0),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0px 5px 30px 0px rgba(0, 0, 0, 0.15)',
}));

export const NarrowSummary = styled(AccordionSummary)(({ theme }) => ({
  '&&': {
    minHeight: 36,
    height: 36,
    paddingBlock: theme.spacing(1),
    paddingInline: theme.spacing(1.5),
    justifyContent: 'unset',
  },
  '& .accordion-header-container': {
    alignItems: 'end',
    gap: theme.spacing(1),
    [`& > .${typographyClasses.root}`]: {
      width: '100%',
    },
  },
  '& .accordion-header-icon': {
    display: 'block',
    margin: 0,
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

export const ErrorIcon = styled(MdError)(({ theme }) => ({
  color: theme.palette.error.main,
  flexShrink: 0,
}));
