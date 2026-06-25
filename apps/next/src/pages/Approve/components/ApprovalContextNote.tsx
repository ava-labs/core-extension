import { FC } from 'react';
import { Stack, Typography, styled } from '@avalabs/k2-alpine';

const NoteContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(0.5),
  padding: theme.spacing(1.5),
  margin: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.surface.secondary,
}));

type ApprovalContextNoteProps = {
  title: string;
  description: string;
};

export const ApprovalContextNote: FC<ApprovalContextNoteProps> = ({
  title,
  description,
}) => (
  <NoteContainer>
    <Typography variant="body3" fontWeight={600} color="text.primary">
      {title}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {description}
    </Typography>
  </NoteContainer>
);
