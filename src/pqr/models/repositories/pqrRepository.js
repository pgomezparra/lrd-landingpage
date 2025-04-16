import myUrl from '@/shared/myUrl.js'
import { PQR_PORT } from '@/shared/constants.js'
import axios from 'axios'

export default class PqrRepository {
  createPqr(name, email, message) {
    const url = `${myUrl(PQR_PORT, true)}/v1/pqr`

    const pqr = {
      name: name,
      email: email,
      message: message
    }

    return axios.post(url, pqr)
  }
}
