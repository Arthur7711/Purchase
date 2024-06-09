import cookie from 'js-cookie'
import { ACCESS_TOKEN, COOKIE_PATH, COOKIE_DOMAIN } from './constants'

export function getCookie(key: string) {
  const allCookies = document.cookie.split(';')
  return allCookies.find((el) => el.includes(key))?.split('=')[1]
}

export function removeCookieToken() {
  cookie.remove(ACCESS_TOKEN, { path: COOKIE_PATH, domain: COOKIE_DOMAIN })
}
