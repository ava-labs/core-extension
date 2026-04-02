export function isKeystoneFirmwareCompatible(
  firmwareVersion: string,
  requiredFirmwareVersion: string,
) {
  const compare = firmwareVersion.localeCompare(
    requiredFirmwareVersion,
    undefined,
    {
      numeric: true,
      sensitivity: 'base',
    },
  );

  // firmwareVersion >= requiredFirmwareVersion
  return compare >= 0;
}
