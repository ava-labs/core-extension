import { Typography } from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

import { ActionDetailsProps } from '../../types';

export const UnknownActionDetails = (_props: ActionDetailsProps) => {
  return (
    <>
      <Card sx={{ py: 1, px: 2, overflow: 'visible' }}>
        <Typography variant="body3">
          This is a placeholder component for VMs that don&apos;t have their
          approval screens implemented yet.
        </Typography>
      </Card>
      <Card sx={{ py: 1, px: 2, overflow: 'visible' }}>
        <Typography variant="body3">
          In nec eros erat. Aliquam justo nisi, euismod eu feugiat ut, facilisis
          accumsan tortor. Integer tellus tortor, tristique in mauris at,
          efficitur lobortis turpis. Vestibulum libero dui, semper et lacus sit
          amet, ultricies maximus elit. Fusce sed risus sed dolor scelerisque
          posuere. Ut efficitur massa vel arcu pulvinar mattis. Nulla vitae
          lorem eros.
        </Typography>
      </Card>
      <Card sx={{ py: 1, px: 2, overflow: 'visible' }}>
        <Typography variant="body3">
          Nunc nunc arcu, sodales vitae sodales vel, tincidunt sit amet magna.
          Cras sagittis, lectus vehicula tincidunt mollis, elit diam venenatis
          orci, sit amet posuere est justo in nulla. Morbi nec eleifend lacus,
          non consectetur libero. Ut commodo nulla ut pretium venenatis.
          Vestibulum rhoncus orci a ante ultrices, sit amet tempus purus
          fermentum. Vestibulum diam nisi, auctor ac vestibulum eget, auctor eu
          quam. Vivamus sagittis turpis dapibus ornare malesuada.
        </Typography>
      </Card>
    </>
  );
};
