import Candidate from '@/admin/content/elections/models/class/candidate.js'

export default class ElectionsUc {
  #electionsRepository = null

  constructor(electionsRepository) {
    this.#electionsRepository = electionsRepository
  }

  async searchCandidates(filters, orders, page, limit) {
    try {
      const response = await this.#electionsRepository.searchCandidates(filters, orders, page, limit)
      const candidates = response.data?.candidates?.map(activity => Candidate.fromJSONResponse(activity))

      return { status: response.status, candidates: candidates, total: response.data?.total }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, candidates: [], total: 0 }
      } else {
        return { status: 500, candidates: [], total: 0 }
      }
    }
  }

  async saveCandidate(candidate) {
    try {
      const response = await this.#electionsRepository.saveCandidate(this.processCandidate(candidate))

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, message: error.response.data?.message }
      } else {
        return { status: 500 }
      }
    }
  }

  async updateCandidate(candidate) {
    try {
      const data = this.processCandidate(candidate)
      data.id = candidate.id
      const response = await this.#electionsRepository.updateCandidate(data)

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, message: error.response.data?.message }
      } else {
        return { status: 500 }
      }
    }
  }

  async searchVotes(filters, orders, page, limit) {
    try {
      const response = await this.#electionsRepository.searchVotes(filters, orders, page, limit)

      return { status: response.status, votes: response.data?.votes, total: response.data?.total }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, votes: [], total: 0 }
      } else {
        return { status: 500, votes: [], total: 0 }
      }
    }
  }

  async getResults(filters, orders, page, limit) {
    try {
      const response = await this.#electionsRepository.getResults(filters, orders, page, limit)
      const candidates = response.data?.results?.map(activity => Candidate.fromJSONResponse(activity))

      return { status: response.status, candidates: candidates, total: response.data?.total }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, results: [], total: 0 }
      } else {
        return { status: 500, results: [], total: 0 }
      }
    }
  }

  async saveVote(vote) {
    try {
      const response = await this.#electionsRepository.saveVote(this.processVote(vote))

      return { status: response.status }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, message: error.response.data?.message }
      } else {
        return { status: 500 }
      }
    }
  }

  processCandidate(candidate) {
    return {
      name: candidate.name,
      type: candidate.type,
      number_list: candidate.numberList,
      logo: candidate.logo,
      year: candidate.year
    }
  }

  processVote(vote) {
    return {
      student_id: vote.studentId,
      comptroller: vote.comptroller,
      ombudsman: vote.ombudsman,
      year: vote.year
    }
  }
}