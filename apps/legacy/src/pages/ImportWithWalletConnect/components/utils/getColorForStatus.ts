import { AccountImportStatus } from '@core/ui';

export const getColorForStatus = (status: AccountImportStatus) => {
  switch (status) {
    case AccountImportStatus.Failed:
      return 'error.main';

    case AccountImportStatus.Successful:
      return 'success.main';
  }
};
