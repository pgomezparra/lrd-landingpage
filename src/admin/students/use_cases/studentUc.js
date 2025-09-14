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

  async searchByDocument(document) {
    try {
      const response = await this.#studentRepository.searchByDocument(document)
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

  async registerStudent(student) {
    try {
      const response = await this.#studentRepository.registerStudent(this.processStudent(student))

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status }
      } else {
        return { status: 500 }
      }
    }
  }

  async updateStudent(student) {
    try {
      const data = this.processStudent(student)
      data.id = student.id
      const response = await this.#studentRepository.updateStudent(data)

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status }
      } else {
        return { status: 500 }
      }
    }
  }

  async promoteStudent(student) {
    try {
      const response = await this.#studentRepository.promoteStudent(student)

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, message: error.response.data.message }
      } else {
        return { status: 500 }
      }
    }
  }

  processStudent(student) {
    return {
      document_type: parseInt(student.documentType),
      document: student.document,
      name: student.name,
      surname: student.surname,
      age: parseInt(student.age),
      active: student.active,
      grade_id: student.grade,
      year: student.year,
      registration: parseInt(student.registration),
      pension: parseInt(student.pension),
      email: student.email,
      parent_document_type: parseInt(student.parentDocumentTypeId),
      parent_document: student.parentDocument,
      parent_name: student.parentName,
      parent_surname: student.parentSurname,
      address: student.address,
      cloud_id: student.cloudId
    }
  }
}