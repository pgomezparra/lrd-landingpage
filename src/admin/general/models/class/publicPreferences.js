export default class PublicPreferences {
  #showInfoModal = false

  static fromJSONResponse(json) {
    return new PublicPreferences()
      .setShowInfoModal(json.show_info_modal)
  }

  getShowInfoModal() {
    return this.#showInfoModal
  }

  setShowInfoModal(showInfoModal) {
    this.#showInfoModal = showInfoModal

    return this
  }
}