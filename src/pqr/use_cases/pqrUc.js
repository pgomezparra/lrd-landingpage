export default class PqrUc {
  #repository

  constructor(repository) {
    this.#repository = repository
  }

  async createPqr(name, email, message) {
    try {
      const response = await this.#repository.createPqr(name, email, message)
      
      return { status: response.status }
    } catch (error) {
      console.log(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status }
      } else if (error.request) {
        return { status: 500 }
      } else {
        return { status: 500 }
      }
    }
  }
}