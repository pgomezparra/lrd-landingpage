import { CANDIDATE_TYPES } from '@/admin/shared/constants.js'

export default class Candidate {
  #id = ''
  #name = ''
  #type = ''
  #numberList = ''
  #logo = ''
  #author = ''
  #votes = 0

  static fromJSONResponse(json) {
    return new Candidate()
      .setId(json.id)
      .setName(json.name)
      .setType(json.type)
      .setNumberList(json.number_list)
      .setLogo(json.logo)
      .setAuthor(json.author)
      .setVotes(json.votes)
  }

  getId() {
    return this.#id
  }

  setId(id) {
    this.#id = id

    return this
  }

  getName() {
    return this.#name
  }

  setName(name) {
    this.#name = name

    return this
  }

  getType() {
    return this.#type
  }

  getTypeStr() {
    return CANDIDATE_TYPES[this.#type]
  }

  setType(type) {
    this.#type = type

    return this
  }

  getNumberList() {
    return this.#numberList
  }

  setNumberList(numberList) {
    this.#numberList = numberList

    return this
  }

  getLogo() {
    return this.#logo
  }

  setLogo(logo) {
    this.#logo = logo

    return this
  }

  getAuthor() {
    return this.#author
  }

  setAuthor(author) {
    this.#author = author

    return this
  }

  getVotes() {
    return this.#votes
  }

  setVotes(votes) {
    this.#votes = votes

    return this
  }
}