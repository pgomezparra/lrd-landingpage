export default class Consolidated {
  #students = 0
  #inflows = []
  #outflows = []
  #totalInflows = 0
  #totalOutflows = 0
  #balance = 0

  static fromJSONResponse(json) {
    return new Consolidated()
      .setStudents(json.students)
      .setInflows(json.inflows)
      .setOutflows(json.outflows)
      .setTotalInflows(json.total_inflows)
      .setTotalOutflows(json.total_outflows)
      .setBalance(json.balance)
  }

  getStudents() {
    return this.#students
  }

  setStudents(students) {
    this.#students = students

    return this
  }

  getInflows() {
    return this.#inflows
  }

  setInflows(inflows) {
    this.#inflows = inflows

    return this
  }

  getOutflows() {
    return this.#outflows
  }

  setOutflows(outflows) {
    this.#outflows = outflows

    return this
  }

  getTotalInflows() {
    return this.#totalInflows
  }

  getTotalInflowsStr() {
    return this.#totalInflows.toLocaleString('es-CO')
  }

  setTotalInflows(totalInflows) {
    this.#totalInflows = totalInflows

    return this
  }

  getTotalOutflows() {
    return this.#totalOutflows
  }

  getTotalOutflowsStr() {
    return this.#totalOutflows.toLocaleString('es-CO')
  }

  setTotalOutflows(totalOutflows) {
    this.#totalOutflows = totalOutflows

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
}