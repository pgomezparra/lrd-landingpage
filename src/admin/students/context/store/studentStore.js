import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import StudentRepository from '@/admin/students/models/repositories/studentRepository.js'
import StudentUc from '@/admin/students/use_cases/studentUc.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'

const studentRepository = new StudentRepository()
const studentUc = new StudentUc(studentRepository)

const preferenceStore = usePreferenceStore()

export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [],
    selectedStudent: null
  }),
  actions: {
    setSelectedStudent(student) {
      if (!student) {
        this.selectedStudent = null
        return
      }
      this.selectedStudent = markRaw(student)
    },
    setStudents(students) {
      this.students = markRaw(students)
    },
    async searchStudents(active) {
      try {
        let year = preferenceStore.selectedYear ? preferenceStore.selectedYear : new Date().getFullYear()
        const response = await studentUc.searchStudents(preferenceStore.selectedGrade, year, active)
        if (response.status === 200) {
          this.students = markRaw(response.students)
        }

        return response
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async searchByDocument(document) {
      try {
        return await studentUc.searchByDocument(document)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async registerStudent(student) {
      try {
        return await studentUc.registerStudent(student)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async updateStudent(student) {
      try {
        return await studentUc.updateStudent(student)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async promoteStudent(student) {
      try {
        const response = await studentUc.promoteStudent(student)
        if (response.status !== 200) {
          notifications.notify(response.message, 'error')
        }

        return response
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})