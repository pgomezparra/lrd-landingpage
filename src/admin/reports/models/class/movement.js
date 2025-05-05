import { format } from '@formkit/tempo'

export default class Movement {
  #id = 0
  #date = ''
  #description = ''
  #value = 0
  #movementType = ''
  #movementMethod = ''
  #author = ''
  #student = ''
  #month = ''

  static fromJSONResponse(json) {
    return new Movement()
      .setId(json.id)
      .setDate(json.date)
      .setDescription(json.description)
      .setValue(json.value)
      .setMovementType(json.movement_type)
      .setMovementMethod(json.movement_method)
      .setAuthor(json.author)
      .setStudent(json.student)
      .setMonth(json.month)
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

  getDateStr() {
    return format(this.#date, 'DD MMM YYYY', 'es-CO')
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

  getValueStr() {
    return this.#value.toLocaleString('es-CO')
  }

  setValue(value) {
    this.#value = value

    return this
  }

  getMovementType() {
    return this.#movementType
  }

  setMovementType(movementType) {
    this.#movementType = movementType

    return this
  }

  getMovementMethod() {
    return this.#movementMethod
  }

  setMovementMethod(movementMethod) {
    this.#movementMethod = movementMethod

    return this
  }

  getAuthor() {
    return this.#author
  }

  setAuthor(author) {
    this.#author = author

    return this
  }

  getStudent() {
    return this.#student
  }

  setStudent(student) {
    this.#student = student

    return this
  }

  getMonth() {
    return this.#month
  }

  setMonth(month) {
    this.#month = month

    return this
  }
}