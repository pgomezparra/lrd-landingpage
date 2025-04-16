import myUrl from '@/shared/myUrl.js'
import { customAxios } from '@/shared/axios.js'

export default class UserRepository {
  async validateUser() {
    let url = `${myUrl(3000)}/api/v1/user/login`

    return customAxios.get(url)
  }
}