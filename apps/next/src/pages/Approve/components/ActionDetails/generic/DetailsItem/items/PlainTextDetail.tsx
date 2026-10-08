import { Typography } from '@avalabs/k2-alpine';

type PlainTextDetailProps = {
  item: string;
};

export const PlainTextDetail = ({ item }: PlainTextDetailProps) => (
  <Typography variant="subtitle3" px={2} py={0.5}>
    {item}
  </Typography>
);
