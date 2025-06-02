import {
  Accordion as K2Accordion,
  AccordionSummary,
  accordionSummaryClasses,
  typographyClasses,
  styled,
  getHexAlpha,
} from '@avalabs/k2-alpine';
import { Typography } from '../../Typography';

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
  },
  '& .accordion-header-container': {
    alignItems: 'end',
    [`& > .${typographyClasses.root}`]: {
      width: '100%',
    },
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: 'unset',
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}`]: {
    color: getHexAlpha(theme.palette.text.primary, 60),
  },
}));

export const FadedText = styled(Typography)(({ theme }) => ({
  color: getHexAlpha(theme.palette.text.primary, 60),
}));
