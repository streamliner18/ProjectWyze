import base64 from 'base-64'
import store from './store'
import history from '../history'

function authHeader (username, password) {
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode(username + ':' + password))
  return headers
}

function auth (state = {}, action) {
  switch (action.type) {
    case 'AUTH_LOGIN':
      if (action.status === 'success') {
        console.log('Login successful')
        // TODO: Redirect to /
        return Object.assign({}, state, {token: action.token, processing: false})
      } else if (action.status === 'failed') {
        console.log('Login failed')
        return Object.assign({}, state, {token: action.token, processing: false})
      } else {
        fetch('/api/auth/login', {
          method: 'GET',
          headers: authHeader(action.username, action.password)
        })
        .then(res => res.json())
        .catch(e => store.dispatch({
          type: 'AUTH_LOGIN',
          status: 'failed'
        }))
        .then(function (json) {
          store.dispatch({
            type: 'AUTH_LOGIN',
            status: 'success',
            token: json.token
          })
          store.dispatch({
            type: 'ROUTE_JUMP',
            to: '/'
          })
        }
        )
        return Object.assign({}, state, {processing: true})
      }
    case 'AUTH_LOGOUT':
      var res = Object.assign({}, state)
      res.token = undefined
      return res
    default:
      return state
  }
}

export { authHeader, auth }

export default auth
