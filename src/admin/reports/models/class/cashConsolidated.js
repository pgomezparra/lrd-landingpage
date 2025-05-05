export default class CashConsolidated {
  #inflows = 0
  #outflows = 0
  #balance = 0
  #cash = 0
  #transfer = 0

  static fromJSONResponse(json) {
    return new CashConsolidated()
      .setInflows(json.inflows)
      .setOutflows(json.outflows)
      .setBalance(json.balance)
      .setCash(json.cash)
      .setTransfer(json.transfer)
  }

  getInflows() {
    return this.#inflows
  }

  getInflowsStr() {
    return this.#inflows.toLocaleString('es-CO')
  }

  setInflows(inflows) {
    this.#inflows = inflows

    return this
  }

  getOutflows() {
    return this.#outflows
  }

  getOutflowsStr() {
    return this.#outflows.toLocaleString('es-CO')
  }

  setOutflows(outflows) {
    this.#outflows = outflows

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

  getCash() {
    return this.#cash
  }

  getCashStr() {
    return this.#cash.toLocaleString('es-CO')
  }

  setCash(cash) {
    this.#cash = cash

    return this
  }

  getTransfer() {
    return this.#transfer
  }

  getTransferStr() {
    return this.#transfer.toLocaleString('es-CO')
  }

  setTransfer(transfer) {
    this.#transfer = transfer

    return this
  }
}