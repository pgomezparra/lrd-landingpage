export default class Payment {
  #id = 0
  #date = ''
  #description = ''
  #month = ''
  #value = 0
  #paymentType = ''
  #excluded = false
  #paymentMethod = ''

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
  }

  getId() {
    return this.#id
  }

  setId(id) {
    this.#id = id

    return this
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

  getPaymentMethod() {
    return this.#paymentMethod
  }

  setPaymentMethod(paymentMethod) {
    this.#paymentMethod = paymentMethod

    return this
  }
}