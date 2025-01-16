// Format utilities
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function formatPrice(price: string | number): string {
  const amount = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceWithDecimals(price: string | number): string {
  const amount = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
