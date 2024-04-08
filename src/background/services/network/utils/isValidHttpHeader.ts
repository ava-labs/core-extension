export const isValidHttpHeader = (name: string, value: string) => {
  try {
    new Headers({
      [name]: value,
    });
    return true;
  } catch {
    return false;
  }
};
