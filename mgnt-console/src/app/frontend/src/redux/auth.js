import base64 from 'base-64'
import cookies from '../cookies'

export const authHeader = (username, password) => {
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode(username + ':' + password))
  return headers
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'AUTH_LOGIN':
      console.log('[STORE] Login processed', action)
      if (action.token) cookies.set('auth-token', action.token)
      return action.token
        ? Object.assign({}, state, {token: action.token})
        : state

    case 'AUTH_LOGOUT':
      var res = Object.assign({}, state)
      res.token = undefined
      cookies.remove('auth-token')
      return res

    default:
      return state
  }
}
