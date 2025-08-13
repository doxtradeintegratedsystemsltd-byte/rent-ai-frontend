export const formatDate = (date: string | Date, locale = "en-NG") =>
  new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(date),
  );

export const formatDateTime = (date: string | Date, locale = "en-NG") =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

export const formatCurrency = (
  amount: number,
  currency = "NGN",
  locale = "en-NG",
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

export const formatDropdownItems = (items: string[]) =>
  items.map((item) => ({
    label: item,
    value: item,
  }));

export const formatAmount = (amount: string): number => {
  return parseFloat(amount);
};
