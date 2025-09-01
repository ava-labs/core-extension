import { Box, Stack, StackProps, Typography } from '@avalabs/k2-alpine';
import { FiAlertCircle } from 'react-icons/fi';

type SimulationAlertBoxProps = StackProps & {
  textLines: string[];
};

export const SimulationAlertBox = ({
  textLines,
  ...stackProps
}: SimulationAlertBoxProps) => {
  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      color="error.main"
      {...stackProps}
    >
      <Box flexShrink={0} lineHeight={1}>
        <FiAlertCircle size={24} />
      </Box>
      <Stack>
        {textLines.map((text) => (
          <Typography variant="caption" fontWeight={500} key={text}>
            {text}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};
