export default class Photo {
  #url = ''
  #publicID = ''

  static fromJSONResponse(json) {
    return new Photo()
      .setUrl(json.url)
      .setPublicID(json.public_id)
  }

  getUrl() {
    return this.#url
  }

  setUrl(url) {
    this.#url = url

    return this
  }

  getPublicID() {
    return this.#publicID
  }

  setPublicID(publicID) {
    this.#publicID = publicID

    return this
  }
}