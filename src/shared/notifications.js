import Swal from 'sweetalert2/dist/sweetalert2.js'

export function notify(message, type = 'warning') {
  Swal.fire({
    icon: type,
    title: message,
    confirmButtonText: 'Aceptar',
    buttonsStyling: true,
    allowEnterKey: true,
    focusConfirm: true,
    customClass: {
      confirmButton: 'button',
      title: 'text-subtitle-information pb-4 pt-3'
    }
  })
}

export const notifications = {
  notify
}