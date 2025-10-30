export function isDevelopment() {
  return false;
  return process.env.NODE_ENV === 'development';
}

export function isProductionBuild() {
  return process.env.RELEASE === 'production';
}
