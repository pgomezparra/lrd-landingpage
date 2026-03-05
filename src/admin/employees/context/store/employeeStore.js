import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import EmployeeRepository from '@/admin/employees/models/repositories/employeeRepository.js'
import EmployeeUc from '@/admin/employees/use_cases/employeeUc.js'

const employeeRepository = new EmployeeRepository()
const employeeUc = new EmployeeUc(employeeRepository)

const preferenceStore = usePreferenceStore()

export const useEmployeeStore = defineStore('employees', {
  state: () => ({
    employees: [],
    selectedEmployee: null
  }),
  actions: {
    setSelectedEmployee(employee) {
      if (!employee) {
        this.selectedEmployee = null
        return
      }
      this.selectedEmployee = markRaw(employee)
    },
    setEmployees(employees) {
      this.employees = markRaw(employees)
    },
    async searchEmployees(active, type) {
      try {
        let year = preferenceStore.selectedYear ? preferenceStore.selectedYear : new Date().getFullYear()

        const filters = [
          {
            field: 'active',
            operator: '=',
            value: `$bool:${active}`,
            group: 'and'
          },
          {
            field: 'year',
            operator: '=',
            value: `$int:${year}`,
            group: 'and'
          }
        ]
        if (type) {
          filters.push({
            field: 'employee_type',
            operator: '=',
            value: `${type}`,
            group: 'and'
          })
        }
        const orders = [
          { order_by: 'name', order_type: 'asc' }
        ]

        const response = await employeeUc.searchEmployees(filters, orders, 1, 0)
        if (response.status === 200) {
          this.employees = markRaw(response.employees)
        }

        return response
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async searchByDocument(document) {
      try {
        const filters = [
          {
            field: 'document_number',
            operator: '=',
            value: `${document}`,
            group: 'and'
          }
        ]
        const orders = [
          { order_by: 'year', order_type: 'desc' }
        ]

        return await employeeUc.searchEmployees(filters, orders, 1, 0)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async exportEmployees(active, month, employeeTypes) {
      try {
        let year = preferenceStore.selectedYear ? preferenceStore.selectedYear : new Date().getFullYear()

        const filters = [
          {
            field: 'active',
            operator: '=',
            value: `$bool:${active}`,
            group: 'and'
          },
          {
            field: 'year',
            operator: '=',
            value: `$int:${year}`,
            group: 'and'
          }
        ]
        employeeTypes.forEach((type) => {
          filters.push({
            field: 'employee_type',
            operator: '=',
            value: `${type}`,
            group: employeeTypes.length > 1 ? 'or' : 'and'
          })
        })
        const orders = [
          { order_by: 'surname', order_type: 'asc' }
        ]

        const response = await employeeUc.exportEmployees(filters, orders, 1, 0, month)
        if (response.status !== 200) {
          notifications.notify('No se pudieron exportar los empleados', 'error')
        }

        return response.status === 200
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async registerEmployee(employee) {
      try {
        return await employeeUc.registerEmployee(employee)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async updateEmployee(employee) {
      try {
        return await employeeUc.updateEmployee(employee)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})