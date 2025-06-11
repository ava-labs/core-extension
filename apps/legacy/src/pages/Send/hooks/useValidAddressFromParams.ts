import { useQueryParams } from '@core/ui';

export const useValidAddressFromParams = (
  validateAddress: (address: string) => boolean,
) => {
  const params = useQueryParams();
  const addressFromParams = params.get('address') ?? '';

  return validateAddress(addressFromParams) ? addressFromParams : '';
};
