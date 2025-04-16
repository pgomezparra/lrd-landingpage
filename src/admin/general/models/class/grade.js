export default class Grade {
  #id = null
  #grade = null
  #nextGradeId = null

  static fromJSONResponse(json) {
    return new Grade()
      .setId(json.id)
      .setGrade(json.grade)
      .setNextGradeId(json.next_grade_id)
  }

  getId() {
    return this.#id
  }

  setId(id) {
    this.#id = id

    return this
  }

  getGrade() {
    return this.#grade
  }

  setGrade(grade) {
    this.#grade = grade

    return this
  }

  getNextGradeId() {
    return this.#nextGradeId
  }

  setNextGradeId(nextGradeId) {
    this.#nextGradeId = nextGradeId

    return this
  }
}