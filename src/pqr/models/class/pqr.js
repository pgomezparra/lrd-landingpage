export default class Pqr {
  #id = ''
  #name = ''
  #email = ''
  #message = ''
  #createdAt = ''

  static fromJSONResponse(json) {
    return new Pqr()
      .setId(json.id)
      .setName(json.name)
      .setEmail(json.email)
      .setMessage(json.message)
      .setCreatedAt(json.created_at)
  }

  getId() {
    return this.#id
  }

  setId(id) {
    this.#id = id

    return this
  }

  getName() {
    return this.#name
  }

  setName(name) {
    this.#name = name

    return this
  }

  getEmail() {
    return this.#email
  }

  setEmail(email) {
    this.#email = email

    return this
  }

  getMessage() {
    return this.#message
  }

  setMessage(message) {
    this.#message = message

    return this
  }

  getCreatedAt() {
    return this.#createdAt
  }

  setCreatedAt(createdAt) {
    this.#createdAt = createdAt

    return this
  }
}