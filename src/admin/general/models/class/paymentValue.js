export default class PaymentValue {
  #gradeId = 0
  #registration = 0
  #pension = 0
  #year = 0

  static fromJSONResponse(json) {
    return new PaymentValue()
      .setGradeId(json.grade_id)
      .setRegistration(json.registration)
      .setPension(json.pension)
      .setYear(json.year)
  }

  getGradeId() {
    return this.#gradeId
  }

  setGradeId(gradeId) {
    this.#gradeId = gradeId

    return this
  }

  getRegistration() {
    return this.#registration
  }

  setRegistration(registration) {
    this.#registration = registration

    return this
  }

  getPension() {
    return this.#pension
  }

  setPension(pension) {
    this.#pension = pension

    return this
  }

  getYear() {
    return this.#year
  }

  setYear(year) {
    this.#year = year

    return this
  }
}
