export default class Student {
  #id = 0
  #documentTypeId = 0
  #documentType = ''
  #document = ''
  #name = ''
  #surname = ''
  #age = 0
  #active = false
  #registration = 0
  #pension = 0
  #gradeId = 0
  #grade = ''
  #year = 0
  #email = ''
  #parentDocumentTypeId = 0
  #parentDocumentType = ''
  #parentDocument = ''
  #parentName = ''

  static fromJSONResponse(json) {
    return new Student()
      .setId(json.id)
      .setDocumentTypeId(json.document_type_id)
      .setDocumentType(json.document_type)
      .setDocument(json.document)
      .setName(json.name)
      .setSurname(json.surname)
      .setAge(json.age)
      .setActive(json.active)
      .setRegistration(json.registration)
      .setPension(json.pension)
      .setGradeId(json.grade_id)
      .setGrade(json.grade)
      .setYear(json.year)
      .setEmail(json.email)
      .setParentDocumentTypeId(json.parent_document_type_id)
      .setParentDocumentType(json.parent_document_type)
      .setParentDocument(json.parent_document)
      .setParentName(json.parent_name)
  }

  getId() {
    return this.#id
  }

  setId(id) {
    this.#id = id

    return this
  }

  getDocumentTypeId() {
    return this.#documentTypeId
  }

  setDocumentTypeId(documentTypeId) {
    this.#documentTypeId = documentTypeId

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

  getRegistration() {
    return this.#registration
  }

  getRegistrationStr() {
    return this.#registration.toLocaleString('es-CO')
  }

  setRegistration(registration) {
    this.#registration = registration

    return this
  }

  getPension() {
    return this.#pension
  }

  getPensionStr() {
    return this.#pension.toLocaleString('es-CO')
  }

  setPension(pension) {
    this.#pension = pension

    return this
  }

  getGradeId() {
    return this.#gradeId
  }

  setGradeId(gradeId) {
    this.#gradeId = gradeId

    return this
  }

  getGrade() {
    return this.#grade
  }

  setGrade(grade) {
    this.#grade = grade

    return this
  }

  getYear() {
    return this.#year
  }

  setYear(year) {
    this.#year = year

    return this
  }

  getEmail() {
    return this.#email
  }

  setEmail(email) {
    this.#email = email

    return this
  }

  getParentDocumentTypeId() {
    return this.#parentDocumentTypeId
  }

  setParentDocumentTypeId(parentDocumentTypeId) {
    this.#parentDocumentTypeId = parentDocumentTypeId

    return this
  }

  getParentDocumentType() {
    return this.#parentDocumentType
  }

  setParentDocumentType(parentDocumentType) {
    this.#parentDocumentType = parentDocumentType

    return this
  }

  getParentDocument() {
    return this.#parentDocument
  }

  setParentDocument(parentDocument) {
    this.#parentDocument = parentDocument

    return this
  }

  getParentName() {
    return this.#parentName
  }

  setParentName(parentName) {
    this.#parentName = parentName

    return this
  }
}