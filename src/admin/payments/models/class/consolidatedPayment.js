export default class ConsolidatedPayment {
  #month = ''
  #value = 0
  #balance = 0
  #monthId = 0
  #paymentTypeId = 0
  #toPay = 0

  static fromJSONResponse(json) {
    return new ConsolidatedPayment()
      .setMonth(json.month)
      .setValue(json.value)
      .setBalance(json.balance)
      .setMonthId(json.month_id)
      .setPaymentTypeId(json.payment_type_id)
      .setToPay(json.to_pay)
  }

  getMonth() {
    return this.#month
  }

  setMonth(month) {
    this.#month = month

    return this
  }

  getValue() {
    return this.#value
  }

  getValueFormatted() {
    return this.#value.toLocaleString('es-CO')
  }

  setValue(value) {
    this.#value = value

    return this
  }

  getBalance() {
    return this.#balance
  }

  getBalanceFormatted() {
    return this.#balance.toLocaleString('es-CO')
  }

  setBalance(balance) {
    this.#balance = balance

    return this
  }

  getMonthId() {
    return this.#monthId
  }

  setMonthId(monthId) {
    this.#monthId = monthId

    return this
  }

  getPaymentTypeId() {
    return this.#paymentTypeId
  }

  setPaymentTypeId(paymentTypeId) {
    this.#paymentTypeId = paymentTypeId

    return this
  }

  getToPay() {
    return this.#toPay
  }

  setToPay(toPay) {
    this.#toPay = toPay

    return this
  }
}