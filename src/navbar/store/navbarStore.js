import { defineStore } from 'pinia'

export const useNavbarStore = defineStore('navbar', {
  state: () => ({
    actualMenu: 'home',
    isOpen: false
  }),
  actions: {
    setActualMenu(value) {
      this.actualMenu = value
    },
    toggleNavbar() {
      this.isOpen = !this.isOpen
    },
    openNavbar() {
      this.isOpen = true
    },
    closeNavbar() {
      this.isOpen = false
    },
    updatePath(route) {
      this.actualMenu = route.name
    }
  }
})