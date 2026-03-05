import { DOCUMENT_TYPES, EMPLOYEE_TYPES } from '@/admin/shared/constants.js'

export default class Employee {
  #id = ''
  #documentType = 0
  #documentNumber = ''
  #name = ''
  #surname = ''
  #salary = 0
  #employeeType = ''
  #active = false
  #year = 0
  #author = ''

  static fromJSONResponse(json) {
    return new Employee()
      .setId(json.id)
      .setDocumentType(json.document_type)
      .setDocumentNumber(json.document_number)
      .setName(json.name.trim())
      .setSurname(json.surname.trim())
      .setSalary(json.salary)
      .setEmployeeType(json.employee_type)
      .setActive(json.active)
      .setYear(json.year)
      .setAuthor(json.author)
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

  getDocumentTypeStr() {
    return DOCUMENT_TYPES[this.#documentType]
  }

  setDocumentType(documentType) {
    this.#documentType = documentType

    return this
  }

  getDocumentNumber() {
    return this.#documentNumber
  }

  setDocumentNumber(documentNumber) {
    this.#documentNumber = documentNumber

    return this
  }

  getName() {
    return this.#name
  }

  setName(name) {
    this.#name = name.trim()

    return this
  }

  getSurname() {
    return this.#surname
  }

  setSurname(surname) {
    this.#surname = surname.trim()

    return this
  }

  getSalary() {
    return this.#salary
  }

  getSalaryStr() {
    return this.#salary.toLocaleString('es-CO')
  }

  setSalary(salary) {
    this.#salary = salary

    return this
  }

  getEmployeeType() {
    return this.#employeeType
  }

  getEmployeeTypeStr() {
    return EMPLOYEE_TYPES[this.#employeeType]
  }

  setEmployeeType(employeeType) {
    this.#employeeType = employeeType

    return this
  }

  isActive() {
    return this.#active
  }

  setActive(active) {
    this.#active = active

    return this
  }

  getYear() {
    return this.#year
  }

  setYear(year) {
    this.#year = year

    return this
  }

  getAuthor() {
    return this.#author
  }

  setAuthor(author) {
    this.#author = author

    return this
  }
}