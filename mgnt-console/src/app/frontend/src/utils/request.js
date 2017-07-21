import store from '../redux/store'
import { authHeader } from '../redux/auth'

export const signedHeader = () => {
  let authState = store.getState().auth
  let header = authHeader(authState.token, '')
  return header
}

export const signedJSONHeader = () => {
  let headers = signedHeader()
  headers.append('Content-Type', 'application/json')
  return headers
}

export const callLogout = () => {
  store.dispatch({type: 'AUTH_LOGOUT'})
}

export const fetchJSON = r => {
  if (r.status === 401) callLogout()
  return r.json()
}
