export default function formatToBrl(value?: number) {
  return value?.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });
}
