import { useAuth0 } from '@auth0/auth0-vue'

const INTERACTIVE_ERRORS = ['login_required', 'consent_required', 'interaction_required']
const REDIRECT_KEY = 'auth0_redirect_target'

export const useAccessToken = () => {
  const auth0 = useAuth0()

  const redirectToLogin = async (error = {}) => {
    const target = window.location.pathname

    if (sessionStorage.getItem(REDIRECT_KEY) === target) {
      console.error('No fue posible obtener el consentimiento de Auth0:', error)
      return
    }

    sessionStorage.setItem(REDIRECT_KEY, target)

    await auth0.loginWithRedirect({
      appState: { target },
      authorizationParams: error.error === 'consent_required' ? { prompt: 'consent' } : undefined
    })
  }

  const getAccessToken = async (options = {}) => {
    try {
      const token = await auth0.getAccessTokenSilently(options)
      sessionStorage.removeItem(REDIRECT_KEY)
      return token
    } catch (error) {
      if (!INTERACTIVE_ERRORS.includes(error.error)) {
        throw error
      }

      await redirectToLogin(error)
      return null
    }
  }

  return { getAccessToken, redirectToLogin }
}
