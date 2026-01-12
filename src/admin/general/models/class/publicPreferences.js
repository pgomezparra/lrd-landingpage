export default class PublicPreferences {
  #showInfoModal = false
  #activeElections = false

  static fromJSONResponse(json) {
    return new PublicPreferences()
      .setShowInfoModal(json.show_info_modal)
      .setActiveElections(json.active_elections)
  }

  getShowInfoModal() {
    return this.#showInfoModal
  }

  setShowInfoModal(showInfoModal) {
    this.#showInfoModal = showInfoModal

    return this
  }

  getActiveElections() {
    return this.#activeElections
  }

  setActiveElections(activeElections) {
    this.#activeElections = activeElections

    return this
  }
}