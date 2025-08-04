function onlyNumbers(str) {
  return str.replace(/\D/g, '')
}

function formatCurrencyNumber(number) {
  return number.toLocaleString('es-CO')
}

export {
  onlyNumbers,
  formatCurrencyNumber
}