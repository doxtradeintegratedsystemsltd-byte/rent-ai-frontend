export function isTokenExpired(expiryTime: string | number): boolean {
  const now = Date.now();
  const expiry =
    typeof expiryTime === "string" ? +new Date(expiryTime) : expiryTime;
  return now >= expiry;
}

export function getTokenExpiry(hours = 1): number {
  return Date.now() + hours * 60 * 60 * 1000;
}
