import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class ElectionsRepository {
  async searchCandidates(filters, orders, page, limit) {
    let url = `${myUrl(3000)}/api/v1/elections/candidate`

    const data = {
      filters: filters,
      orders: orders,
      limit: limit,
      offset: limit * (page - 1)
    }

    url += `?criteria=${JSON.stringify(data).replace(/#/g, '%23')}`

    return customAxios.get(url)
  }

  async saveCandidate(candidate) {
    let url = `${myUrl(3000)}/api/v1/elections/candidate`

    return customAxios.post(url, candidate)
  }

  async updateCandidate(candidate) {
    let url = `${myUrl(3000)}/api/v1/elections/candidate/${candidate.id}`

    return customAxios.patch(url, candidate)
  }

  async searchVotes(filters, orders, page, limit) {
    let url = `${myUrl(3000)}/api/v1/elections/vote`

    const data = {
      filters: filters,
      orders: orders,
      limit: limit,
      offset: limit * (page - 1)
    }

    url += `?criteria=${JSON.stringify(data).replace(/#/g, '%23')}`

    return customAxios.get(url)
  }

  async getResults(filters, orders, page, limit) {
    let url = `${myUrl(3000)}/api/v1/elections/results`

    const data = {
      filters: filters,
      orders: orders,
      limit: limit,
      offset: limit * (page - 1)
    }

    url += `?criteria=${JSON.stringify(data).replace(/#/g, '%23')}`

    return customAxios.get(url)
  }

  async saveVote(vote) {
    let url = `${myUrl(3000)}/api/v1/elections/vote`

    return customAxios.post(url, vote)
  }
}