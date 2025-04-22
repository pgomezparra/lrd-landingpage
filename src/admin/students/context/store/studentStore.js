import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import StudentRepository from '@/admin/students/models/repositories/studentRepository.js'
import StudentUc from '@/admin/students/use_cases/studentUc.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

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
      this.selectedStudent = markRaw(student)
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
    }
  }
})