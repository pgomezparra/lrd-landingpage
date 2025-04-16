import Student from '@/admin/students/models/class/student.js'

export default class StudentUc {
  #studentRepository = null

  constructor(studentRepository) {
    this.#studentRepository = studentRepository
  }

  async searchStudents(gradeId, year, active) {
    try {
      const response = await this.#studentRepository.searchStudents(gradeId, year, active)
      const students = response.data.map(student => Student.fromJSONResponse(student))

      return { status: response.status, students: students }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, students: [] }
      } else {
        return { status: 500, students: [] }
      }
    }
  }
}