// src/utils/auth.js
import Cookies from 'js-cookie'

export function isAuthenticated() {
  return !!Cookies.get('authToken')   // true if cookie exists
}
