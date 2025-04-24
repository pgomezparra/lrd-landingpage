function formatDate(date) {
  const parsedDate = new Date(date)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(parsedDate)
}

function onlyNumbers(str) {
  return str.replace(/\D/g, '')
}

export {
  formatDate,
  onlyNumbers
}