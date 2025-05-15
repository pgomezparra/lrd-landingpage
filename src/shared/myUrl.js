/**
 * Determina la url de conexion al dispatch
 */
export default function(localPort, pqr) {
  let location = document.location

  const hostname = location.hostname

  /**
   *
   * Cuando se esta desarrollando el proyecto y se lanza con "yarn serve", y el dominio es "localhost"
   *
   */

  if (hostname === 'localhost') {
    return `https://admin-lrd-development.vercel.app`
    // return `http://localhost:${localPort}`
  }

  let proto = 'http:'
  if (location.protocol === 'https:') {
    proto = 'https:'
  }

  let port = ''
  if (location.port !== '' && location.port !== 80 && location.port !== 443) {
    port = `:${location.port}`
  }

  // return `${proto}//${hostname}${port}`
  return pqr ? `${proto}//pqr-lrd.vercel.app${port}` : `${proto}//admin-lrd.vercel.app${port}`
}
