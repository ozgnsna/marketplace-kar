/**
 * Tahsilat yönetim oranı — sipariş tutarına göre kademeli (Hepsiburada hakediş mantığına uygun örnek).
 * TODO: Güncel tablo ile doğrulanacak.
 */
export function getPaymentFeeRateByOrderAmount(orderAmountTl: number): number {
  const x = Math.max(0, orderAmountTl);
  if (x <= 0) return 1.5;
  if (x < 1000) return 2;
  if (x < 5000) return 1.5;
  return 1;
}
