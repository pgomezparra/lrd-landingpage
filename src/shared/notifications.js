import Swal from 'sweetalert2'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

export function notify(message, type = 'warning') {
  const preferencesStore = usePreferenceStore()
  const isDarkMode = preferencesStore.theme === 'dark'

  const privateContainer = document.getElementById('private-content')

  Swal.fire({
    target: privateContainer || document.body,
    icon: type,
    title: message,
    confirmButtonText: 'Aceptar',
    buttonsStyling: true,
    allowEnterKey: true,
    focusConfirm: true,
    customClass: {
      popup: isDarkMode ? 'swal-dark' : 'swal-light',
      confirmButton: 'button',
      title: 'text-subtitle-information pb-4 pt-3'
    }
  })
}

export const notifications = {
  notify
}