export function isDevelopment() {
  return true;
  return process.env.NODE_ENV === 'development';
}

export function isProductionBuild() {
  return false;
  return process.env.RELEASE === 'production';
}
