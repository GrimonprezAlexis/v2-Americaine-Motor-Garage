// Format utilities
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function formatPrice(price: string | number): string {
  // Si le prix est une chaîne, essayez de la convertir en nombre
  const amount =
    typeof price === "string"
      ? parseFloat(price.replace(/[^\d.,]/g, ""))
      : price;

  // Si la conversion échoue ou si le montant n'est pas un nombre valide, retournez le prix original
  if (isNaN(amount)) {
    return typeof price === "string" ? price : String(price);
  }

  // Formater le prix avec le symbole € et l'espace insécable
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceWithDecimals(price: string | number): string {
  const amount =
    typeof price === "string"
      ? parseFloat(price.replace(/[^\d.,]/g, ""))
      : price;

  if (isNaN(amount)) {
    return typeof price === "string" ? price : String(price);
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
