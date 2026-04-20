/** KDV dahil tutardan KDV tutarı (tek oran, bilgi amaçlı ayrıştırma) */
export function vatFromGross(gross: number, vatPercent: number): number {
  if (gross <= 0 || vatPercent <= 0) return 0;
  return (gross * vatPercent) / (100 + vatPercent);
}
