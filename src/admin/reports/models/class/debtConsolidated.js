export default class DebtConsolidated {
  #balance = 0
  #totalBalance = 0

  static fromJSONResponse(json) {
    return new DebtConsolidated()
      .setTotalBalance(json.total)
      .setBalance(json.selected)
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