export default class Student {
  #id = 0
  #documentType = ''
  #document = ''
  #name = ''
  #surname = ''
  #age = 0
  #active = false

  static fromJSONResponse(json) {
    return new Student()
      .setId(json.id)
      .setDocumentType(json.document_type)
      .setDocument(json.document)
      .setName(json.name)
      .setSurname(json.surname)
      .setAge(json.age)
      .setActive(json.active)
  }

  getId() {
    return this.#id
  }

  setId(id) {
    this.#id = id

    return this
  }

  getDocumentType() {
    return this.#documentType
  }

  setDocumentType(documentType) {
    this.#documentType = documentType

    return this
  }

  getDocument() {
    return this.#document
  }

  setDocument(document) {
    this.#document = document

    return this
  }

  getName() {
    return this.#name
  }

  setName(name) {
    this.#name = name

    return this
  }

  getSurname() {
    return this.#surname
  }

  setSurname(surname) {
    this.#surname = surname

    return this
  }

  getAge() {
    return this.#age
  }

  setAge(age) {
    this.#age = age

    return this
  }

  isActive() {
    return this.#active
  }

  setActive(active) {
    this.#active = active

    return this
  }
}