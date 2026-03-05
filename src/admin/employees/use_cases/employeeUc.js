import Employee from '@/admin/employees/models/class/employee.js'

export default class EmployeeUc {
  #employeeRepository = null

  constructor(employeeRepository) {
    this.#employeeRepository = employeeRepository
  }

  async searchEmployees(filters, orders, page, limit) {
    try {
      const response = await this.#employeeRepository.searchEmployees(filters, orders, page, limit, false)
      const employees = response.data.employees.map(employee => Employee.fromJSONResponse(employee))

      return { status: response.status, employees: employees, total: response.total }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, employees: [], total: 0 }
      } else {
        return { status: 500, employees: [], total: 0 }
      }
    }
  }

  async exportEmployees(filters, orders, page, limit, month) {
    try {
      const response = await this.#employeeRepository.searchEmployees(filters, orders, page, limit, true, month)

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      window.open(url)

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

  async registerEmployee(employee) {
    try {
      const response = await this.#employeeRepository.registerEmployee(this.processEmployee(employee))

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

  async updateEmployee(employee) {
    try {
      const response = await this.#employeeRepository.updateEmployee(this.processEmployee(employee))

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

  processEmployee(employee) {
    return {
      document_type: employee.documentType,
      document_number: employee.document,
      name: employee.name,
      surname: employee.surname,
      active: employee.active,
      salary: parseInt(employee.salary),
      employee_type: employee.type,
      year: parseInt(employee.year),
      id: employee.id
    }
  }
}