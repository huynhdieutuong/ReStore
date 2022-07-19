export const currencyFormat = (amount: number) =>
  `$${(amount / 100).toFixed(2)}`

export const getCookie = (key: string) => {
  const b = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)')
  return b ? b.pop() : ''
}
