import { format } from '@formkit/tempo'

export default class Payment {
  #id = 0
  #date = ''
  #description = ''
  #month = ''
  #value = 0
  #paymentType = ''
  #excluded = false
  #paymentMethod = ''
  #paymentTypeId = 0
  #monthId = 0
  #paymentMethodId = 0
  #transferCode = ''

  static fromJSONResponse(json) {
    return new Payment()
      .setId(json.id)
      .setDate(json.date)
      .setDescription(json.description)
      .setMonth(json.month)
      .setValue(json.value)
      .setPaymentType(json.payment_type)
      .setExcluded(json.excluded)
      .setPaymentMethod(json.payment_method)
      .setPaymentTypeId(json.payment_type_id)
      .setMonthId(json.month_id)
      .setPaymentMethodId(json.payment_method_id)
      .setTransferCode(json.transfer_code)
  }

  getId() {
    return this.#id
  }

  setId(id) {
    this.#id = id

    return this
  }

  getDateStr() {
    return format(this.#date, 'DD MMM YYYY', 'es-CO')
  }

  getDate() {
    return this.#date
  }

  setDate(date) {
    this.#date = date

    return this
  }

  getDescription() {
    return this.#description
  }

  setDescription(description) {
    this.#description = description

    return this
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

  isPension() {
    return this.#paymentType === 'Pensión'
  }

  getPaymentType() {
    return this.#paymentType
  }

  setPaymentType(paymentType) {
    this.#paymentType = paymentType

    return this
  }

  isExcluded() {
    return this.#excluded
  }

  setExcluded(excluded) {
    this.#excluded = excluded

    return this
  }

  isTransfer() {
    return this.#paymentMethod === 'Transferencia'
  }

  getPaymentMethod() {
    return this.#paymentMethod
  }

  setPaymentMethod(paymentMethod) {
    this.#paymentMethod = paymentMethod

    return this
  }

  getPaymentTypeId() {
    return this.#paymentTypeId
  }

  setPaymentTypeId(paymentTypeId) {
    this.#paymentTypeId = paymentTypeId

    return this
  }

  getMonthId() {
    return this.#monthId
  }

  setMonthId(monthId) {
    this.#monthId = monthId

    return this
  }

  getPaymentMethodId() {
    return this.#paymentMethodId
  }

  setPaymentMethodId(paymentMethodId) {
    this.#paymentMethodId = paymentMethodId

    return this
  }

  getTransferCode() {
    return this.#transferCode
  }

  setTransferCode(transferCode) {
    this.#transferCode = transferCode

    return this
  }
}