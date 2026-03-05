import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class EmployeeRepository {
  async searchEmployees(filters, orders, page, limit, exportEmployees, month = '') {
    let url = `${myUrl(3000)}/api/v1/employees`

    const data = {
      filters: filters,
      orders: orders,
      limit: limit,
      offset: limit * (page - 1)
    }

    url += `?criteria=${JSON.stringify(data).replace(/#/g, '%23')}`

    if (exportEmployees) {
      url = `${url}&format=pdf&month=${month}`

      return customAxios.get(url, {
        responseType: 'blob'
      })
    }

    return customAxios.get(url)
  }

  async registerEmployee(employee) {
    let url = `${myUrl(3000)}/api/v1/employees`

    return customAxios.post(url, employee)
  }

  async updateEmployee(employee) {
    let url = `${myUrl(3000)}/api/v1/employees/${employee.id}`

    return customAxios.patch(url, employee)
  }
}