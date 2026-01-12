export const calculateDeviceRisk = ({
  isKnownDevice,
  isVerified,
  deviceCount,
  maxDevices = 2
}) => {
  let risk = 0;

  if (!isKnownDevice) risk += 10;
  if (!isVerified) risk += 5;
  if (deviceCount > maxDevices) risk += 10;

  return risk;
};
