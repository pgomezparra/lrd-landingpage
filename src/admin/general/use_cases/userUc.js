import User from '@/admin/general/models/class/user.js'

export default class UserUc {
  #userRepository = null

  constructor(userRepository) {
    this.#userRepository = userRepository
  }

  async validateUser() {
    try {
      const response = await this.#userRepository.validateUser()

      return { status: response.status, user: User.fromJSONResponse(response.data) }
    } catch (error) {
      console.error(`error: ${error}`)
      if (error.response) {
        return { status: error.response.status, user: new User() }
      } else {
        return { status: 500, user: new User() }
      }
    }
  }
}