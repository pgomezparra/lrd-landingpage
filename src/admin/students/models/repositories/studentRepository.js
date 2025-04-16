import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class StudentRepository {
  async searchStudents(gradeId, year, active) {
    let url = `${myUrl(3000)}/api/v1/students?gradeId=${gradeId}&year=${year}&active=${active}`

    return customAxios.get(url)
  }
}