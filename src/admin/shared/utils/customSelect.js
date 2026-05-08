const openDropdowns = []

const closeAllDropdowns = () => {
  openDropdowns.forEach(closeFn => closeFn())
  openDropdowns.length = 0
}

export const useCustomSelect = () => {
  const registerDropdown = (closeFn) => {
    openDropdowns.push(closeFn)
    if (openDropdowns.length > 1) {
      closeAllDropdowns()
    }
  }

  const unregisterDropdown = (closeFn) => {
    const index = openDropdowns.indexOf(closeFn)
    if (index > -1) {
      openDropdowns.splice(index, 1)
    }
  }

  const handleClickOutside = (event) => {
    const select = event.target.closest('.custom-select')
    if (!select) {
      closeAllDropdowns()
    }
  }

  return {
    registerDropdown,
    unregisterDropdown,
    closeAllDropdowns,
    handleClickOutside
  }
}