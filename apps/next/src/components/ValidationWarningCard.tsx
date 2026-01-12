import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { FiAlertTriangle } from 'react-icons/fi';

import { Card } from './Card';

type ValidationWarningCardProps = {
  textLines: string[];
};

export const ValidationWarningCard = ({
  textLines,
}: ValidationWarningCardProps) => {
  return (
    <Card sx={{ width: '100%' }}>
      <Stack
        direction="row"
        gap={1.5}
        alignItems="center"
        sx={{ px: 2, py: 1.5 }}
      >
        <Box flexShrink={0} lineHeight={1} sx={{ color: 'warning.main' }}>
          <FiAlertTriangle size={24} />
        </Box>
        <Stack gap={0.5}>
          {textLines.map((text, index) => (
            <Typography
              variant="caption"
              fontWeight={index === 0 ? 600 : 500}
              key={text}
              sx={{ color: index === 0 ? 'text.primary' : 'text.secondary' }}
            >
              {text}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};
