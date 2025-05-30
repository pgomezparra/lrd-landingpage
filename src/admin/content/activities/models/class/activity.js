import { format } from '@formkit/tempo'
import Photo from '@/admin/content/activities/models/class/photo.js'

export default class Activity {
  #id = ''
  #title = ''
  #description = ''
  /*
   * @type {Photo[]}
   */
  #photos = []
  #createdAt = 0
  #updatedAt = 0
  #author = ''

  static fromJSONResponse(json) {
    return new Activity()
      .setId(json.id)
      .setTitle(json.title)
      .setDescription(json.description)
      .setPhotos(json.photos.map(Photo.fromJSONResponse))
      .setCreatedAt(json.created_at)
      .setUpdatedAt(json.updated_at)
      .setAuthor(json.author)
  }

  getId() {
    return this.#id
  }

  setId(id) {
    this.#id = id

    return this
  }

  getTitle() {
    return this.#title
  }

  setTitle(title) {
    this.#title = title

    return this
  }

  getDescription() {
    return this.#description
  }

  setDescription(description) {
    this.#description = description

    return this
  }

  getPhotos() {
    return this.#photos
  }

  setPhotos(photos) {
    this.#photos = photos

    return this
  }

  getCreatedAt() {
    return this.#createdAt
  }

  getCreatedAtStr() {
    return format(new Date(this.#createdAt), 'DD MMM YYYY', 'es-CO')
  }

  setCreatedAt(createdAt) {
    this.#createdAt = createdAt

    return this
  }

  getUpdatedAt() {
    return this.#updatedAt
  }

  getUpdatedAtStr() {
    return format(new Date(this.#updatedAt), 'DD MMM YYYY', 'es-CO')
  }

  setUpdatedAt(updatedAt) {
    this.#updatedAt = updatedAt

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