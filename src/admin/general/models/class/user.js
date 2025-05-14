export default class User {
  #id = ''
  #name = ''
  #email = ''
  #active = false
  #roles = []

  static fromJSONResponse(json) {
    return new User()
      .setId(json.id)
      .setName(json.name)
      .setEmail(json.email)
      .setActive(json.active)
      .setRoles(json.roles)
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

  isActive() {
    return this.#active
  }

  setActive(active) {
    this.#active = active

    return this
  }

  getRoles() {
    return this.#roles
  }

  hasRole(roles) {
    return this.#roles.some(role => roles.includes(role))
  }

  setRoles(roles) {
    this.#roles = roles

    return this
  }
}