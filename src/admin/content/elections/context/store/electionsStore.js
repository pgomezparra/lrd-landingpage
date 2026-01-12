import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { CANDIDATES_PER_PAGE } from '@/admin/shared/constants.js'
import ElectionsRepository from '@/admin/content/elections/models/repositories/electionsRepository.js'
import ElectionsUc from '@/admin/content/elections/use_cases/electionsUc.js'

const electionsRepository = new ElectionsRepository()
const electionsUc = new ElectionsUc(electionsRepository)

export const useElectionsStore = defineStore('elections', {
  state: () => ({
    selectedCandidate: null,
    orders: [
      { order_by: 'type', order_type: 'desc' }
    ],
    page: 1,
    total: 0,
    candidates: []
  }),
  actions: {
    setSelectedCandidate(candidate) {
      if (candidate === null) {
        this.selectedCandidate = null
        return
      }
      this.selectedCandidate = markRaw(candidate)
    },
    setPage(page) {
      this.page = page
    },
    setTotal(total) {
      this.total = total
    },
    setCandidates(candidates) {
      this.candidates = markRaw(candidates)
    },
    async searchCandidates(year) {
      try {
        const response = await electionsUc.searchCandidates([
          {
            field: 'year',
            operator: '=',
            value: `$int:${year}`,
            group: 'and'
          }
        ], this.orders, this.page, CANDIDATES_PER_PAGE)

        this.setCandidates(response.candidates)
        this.setTotal(response.total)

        return response.status === 200
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async validateVote(studentId, year) {
      try {
        return await electionsUc.searchVotes([
          {
            field: 'year',
            operator: '=',
            value: `$int:${year}`,
            group: 'and'
          },
          {
            field: 'student_id',
            operator: '=',
            value: `$int:${studentId}`,
            group: 'and'
          }
        ], this.orders, this.page, CANDIDATES_PER_PAGE)

      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async getResults(year) {
      try {
        return await electionsUc.getResults([
          {
            field: 'year',
            operator: '=',
            value: `$int:${year}`,
            group: 'and'
          }
        ], this.orders, this.page, CANDIDATES_PER_PAGE)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async saveCandidate(candidate) {
      try {
        return await electionsUc.saveCandidate(candidate)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async updateCandidate(candidate) {
      try {
        console.log(candidate)
        return await electionsUc.updateCandidate(candidate)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    },
    async saveVote(vote) {
      try {
        return await electionsUc.saveVote(vote)
      } catch (error) {
        console.error(`error: ${error}`)
      }
    }
  }
})