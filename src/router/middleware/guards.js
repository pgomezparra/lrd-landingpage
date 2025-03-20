let isUserValidated = true // Simulación de validación

export async function validateRegisteredUser(to, from, next) {
  if (isUserValidated) {
    next() // Si ya está validado, continuamos
    return
  }

  try {
    // Aquí iría la lógica de validación de usuario
    // const user = await getUserProfile() // Obtener perfil del usuario
    // const response = await axios.get(`/api/users/${user.sub}`)
    // if (response.data.isValid) {
    //   isUserValidated = true
    //   next() // Si el usuario está validado, pasamos al siguiente
    // } else {
    next({ name: 'home' }) // Si no está validado, redirigimos al home
    // }
  } catch (error) {
    console.error('Error validando al usuario:', error)
    next({ name: 'home' })
  }
}