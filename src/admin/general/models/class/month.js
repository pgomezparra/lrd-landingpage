export default class Month {
  #id = 0
  #month = ''

  static fromJSONResponse(json) {
    return new Month()
      .setId(json.id)
      .setMonth(json.month)
  }

  getId() {
    return this.#id
  }

  setId(id) {
    this.#id = id

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