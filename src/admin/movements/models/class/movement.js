import { format } from '@formkit/tempo'

export default class Movement {
  #id = 0
  #date = ''
  #description = ''
  #value = 0
  #movementType = ''
  #movementMethod = ''
  #movementTypeId = 0
  #movementMethodId = 0
  #author = ''

  static fromJSONResponse(json) {
    return new Movement()
      .setId(json.id)
      .setDate(json.date)
      .setDescription(json.description)
      .setValue(json.value)
      .setMovementType(json.movement_type)
      .setMovementMethod(json.movement_method)
      .setMovementTypeId(json.movement_type_id)
      .setMovementMethodId(json.movement_method_id)
      .setAuthor(json.author)
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

  isIngress() {
    return this.#movementType === 'Entrada'
  }

  getMovementType() {
    return this.#movementType
  }

  setMovementType(paymentType) {
    this.#movementType = paymentType

    return this
  }

  getMovementMethod() {
    return this.#movementMethod
  }

  setMovementMethod(paymentMethod) {
    this.#movementMethod = paymentMethod

    return this
  }

  getMovementTypeId() {
    return this.#movementTypeId
  }

  setMovementTypeId(paymentTypeId) {
    this.#movementTypeId = paymentTypeId

    return this
  }

  getMovementMethodId() {
    return this.#movementMethodId
  }

  setMovementMethodId(paymentMethodId) {
    this.#movementMethodId = paymentMethodId

    return this
  }

  getAuthor() {
    return this.#author
  }

  setAuthor(author) {
    this.#author = author

    return this
  }
}