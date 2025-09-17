export default class ExternalProduct {
  #name = ''
  #code = ''

  static fromJSONResponse(json) {
    return new ExternalProduct()
      .setName(json.name)
      .setCode(json.code)
  }

  getName() {
    return this.#name
  }

  setName(name) {
    this.#name = name

    return this
  }

  getCode() {
    return this.#code
  }

  setCode(code) {
    this.#code = code

    return this
  }
}