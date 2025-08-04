import { MONTHS } from '@/admin/shared/constants.js'

function getFilteredConsolidated(student, payment, payments) {
  const registration = student.getRegistration()
  const pension = student.getPension()

  const filtered = []
  const registrationPayments = payments.filter(item => item.getId() <= payment.getId() && item.getPaymentTypeId() === 1)
  const pensionPayments = payments.filter(item => item.getId() <= payment.getId() && item.getPaymentTypeId() === 2)

  const registrationPaid = registrationPayments.reduce((acc, curr) => acc + curr.getValue(), 0)
  filtered[0] = {
    month_id: 0,
    month: '',
    value: registrationPaid,
    balance: registrationPaid >= registration ? 0 : registration - registrationPaid
  }

  for (let i = 1; i < 11; i++) {
    const monthPayments = pensionPayments.filter(item => item.getMonthId() === i + 1)
    const paid = monthPayments.reduce((acc, curr) => acc + curr.getValue(), 0)
    const excluded = payments.find(item => item.isExcluded() && item.getMonthId() === i + 1)
    filtered[i] = {
      month_id: i + 1,
      month: MONTHS[i],
      value: paid,
      balance: paid >= pension || excluded ? 0 : pension - paid
    }
  }

  return filtered
}

export {
  getFilteredConsolidated
}