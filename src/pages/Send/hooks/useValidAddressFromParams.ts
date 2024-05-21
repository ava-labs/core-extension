import { useQueryParams } from '@src/hooks/useQueryParams';

export const useValidAddressFromParams = (
  validateAddress: (address: string) => boolean
) => {
  const params = useQueryParams();
  const addressFromParams = params.get('address') ?? '';

  return validateAddress(addressFromParams) ? addressFromParams : '';
};
