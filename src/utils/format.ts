export const currency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  })
    .format(value)
    .slice(0, -3);
