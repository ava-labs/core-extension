export function dataParser(data: any) {
  return (data.params as any[]).reduce(
    (acc, prop) => {
      return {
        ...acc,
        [prop.name]: prop.value,
      };
    },
    { contractCall: data.name }
  );
}
