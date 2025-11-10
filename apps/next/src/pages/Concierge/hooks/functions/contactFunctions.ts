export interface CreateContactParams {
  name: string;
  address: string;
  addressBitcoin?: string;
  addressAvalanche?: string;
}

export interface CreateContactDeps {
  createContact: (contact: any) => Promise<void>;
}

export const createCreateContactFunction = ({
  createContact,
}: CreateContactDeps) => {
  return async ({
    name,
    address,
    addressBitcoin,
    addressAvalanche,
  }: CreateContactParams) => {
    await createContact({
      id: '',
      name,
      address,
      addressBTC: addressBitcoin,
      addressXP: addressAvalanche,
    });

    return {
      content: `Success! New contact added!`,
    };
  };
};
