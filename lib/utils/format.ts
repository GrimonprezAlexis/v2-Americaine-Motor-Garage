export function formatPrice(price: string | number): string {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  return `${value.toFixed(2)} €`;
}