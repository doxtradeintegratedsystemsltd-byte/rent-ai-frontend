export function isTokenExpired(expiryTime: string | number): boolean {
  const now = Date.now();
  const expiry =
    typeof expiryTime === "string" ? +new Date(expiryTime) : expiryTime;
  return now >= expiry;
}

export function getTokenExpiry(hours = 1): number {
  return Date.now() + hours * 60 * 60 * 1000;
}

export function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options).toUpperCase();
}

export function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options).toUpperCase();
}
