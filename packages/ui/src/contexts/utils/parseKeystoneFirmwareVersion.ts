const MAJOR_VERSION_OFFSET = 10;

/**
 * As confirmed by the Keystone team, the firmware version reported
 * through the USB transport is intentionally off by 10 major versions.
 *
 * @see https://github.com/ava-labs/core-extension/pull/881#issuecomment-4196107552
 *
 * For example:
 *
 *   - device displays version 2.4.2 in its UI
 *   - when queried through .getConfig(), the USB transport returns 12.4.2
 *
 * This util parses the reported version and returns the same version as the device
 * would display in its own UI.
 */
export const parseKeystoneFirmwareVersion = (
  reportedVersion: string,
): string => {
  const [major, minor, patch] = reportedVersion.split('.');

  if (!major || !minor || !patch) {
    console.error(
      '[parseKeystoneFirmwareVersion] Non-SemVer firmware version reported:',
      reportedVersion,
    );

    return reportedVersion;
  }

  const actualMajorVersion = parseInt(major, 10) - MAJOR_VERSION_OFFSET;
  return [actualMajorVersion, minor, patch].join('.');
};
