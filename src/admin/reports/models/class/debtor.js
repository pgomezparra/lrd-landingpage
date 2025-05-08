export default class Debtor {
  #id = ''
  #name = ''
  #grade = ''
  #balance = 0
  #totalBalance = 0

  static fromJSONResponse(json) {
    return new Debtor()
      .setId(json.id)
      .setName(json.name)
      .setGrade(json.grade)
      .setBalance(json.balance)
      .setTotalBalance(json.total_balance)
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

  getGrade() {
    return this.#grade
  }

  setGrade(grade) {
    this.#grade = grade

    return this
  }

  getBalance() {
    return this.#balance
  }

  getBalanceStr() {
    return this.#balance.toLocaleString('es-CO')
  }

  setBalance(balance) {
    this.#balance = balance

    return this
  }

  getTotalBalance() {
    return this.#totalBalance
  }

  getTotalBalanceStr() {
    return this.#totalBalance.toLocaleString('es-CO')
  }

  setTotalBalance(totalBalance) {
    this.#totalBalance = totalBalance

    return this
  }
}