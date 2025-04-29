import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class StudentRepository {
  async searchStudents(gradeId, year, active) {
    let url = `${myUrl(3000)}/api/v1/students?gradeId=${gradeId}&year=${year}&active=${active}`

    return customAxios.get(url)
  }

  async searchByDocument(document) {
    let url = `${myUrl(3000)}/api/v1/students?document=${document}`

    return customAxios.get(url)
  }

  async registerStudent(student) {
    let url = `${myUrl(3000)}/api/v1/students`

    return customAxios.post(url, student)
  }

  async updateStudent(student) {
    let url = `${myUrl(3000)}/api/v1/students/${student.id}`

    return customAxios.patch(url, student)
  }

  async promoteStudent(student) {
    let url = `${myUrl(3000)}/api/v1/students/${student.getId()}/promote/${student.getYear()}`

    return customAxios.post(url)
  }
}