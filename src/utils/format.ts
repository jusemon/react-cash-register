export const currency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  })
    .format(value)
    .slice(0, -3);

export const date = (value: string) =>
    new Date(value).toLocaleString('es-CO')
  