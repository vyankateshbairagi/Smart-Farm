const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (error) {
    return null
  }
}

export const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem(USER_KEY)
    return rawUser ? JSON.parse(rawUser) : null
  } catch (error) {
    return null
  }
}

export const getStoredSession = () => ({
  token: getStoredToken(),
  user: getStoredUser(),
})

export const setStoredSession = ({ token, user }) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  } catch (error) {
    // Ignore storage failures in restricted environments.
  }
}

export const clearStoredSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch (error) {
    // Ignore storage failures in restricted environments.
  }
}